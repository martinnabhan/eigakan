import { prisma } from '@eigakan/db';
import { cinemas } from '@eigakan/lib/cinemas';
import { parse, setHours, setMinutes, setSeconds } from 'date-fns';
import { JSDOM } from 'jsdom';
import { Page, chromium } from 'playwright';
import { TMDB } from 'tmdb-ts';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmU4MTZhOTUwMGEzNzZjZTQ4MDA1MjE1ODNhZDViNyIsInN1YiI6IjU5ODcwMWI1YzNhMzY4Mzc1ZjAwY2U2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eD86wBxafAhSqsnS1HZhoYtw9gUMmELMyi4gNmbetQs',
);

const featureMap = {
  '4Kレストア版': '4Kレストア版',
  'BESTIA enhanced': 'BESTIA',
  'Dolby Atmos': 'Dolby Atmos',
  PG12: 'PG12',
  'R15+': 'R15+',
  // TODO: '午前十時の映画祭14『インディ・ジョーンズ／魔宮の伝説』',
  '【4DXSCREEN字幕版】': '4DXSCREEN', // TODO: 字幕？
  '【4DX版】': '4DX',
  '【IMAXレーザーGT字幕版】': 'IMAX', // TODO: 字幕？
  '【IMAXレーザーGT版】': 'IMAX',
  '【吹替版】': '吹替版',
  '【字幕版】': '字幕版',
  製作70周年: '製作70周年',
};

const parseDay = () => {
  const dayString = document.querySelector('.schedule-swiper__item.active .day')?.innerHTML;

  if (!dayString) {
    return;
  }

  return parse(dayString, 'MM/dd', new Date());
};

const parseMovies = async (day: Date) =>
  (
    await Promise.all([...document.querySelectorAll('#tab1_content .content-item')].map(movieElement => parseMovie(movieElement, day)))
  ).flat();

const parseMovie = async (movieElement: Element, day: Date) => {
  let title = movieElement.querySelector('.title')?.textContent?.replace(' / ', '').trim();

  if (!title) {
    return [];
  }

  const features = [];

  for (const [match, feature] of Object.entries(featureMap)) {
    title = title.replace(match, '');
    features.push(feature);
  }

  // TODO: features

  // TODO: キャッシュ
  const { results } = await tmdb.search.movies({ language: 'ja-JP', query: title });

  // TODO: 見つからない場合は？
  if (results.length === 0) {
    return;
  }

  title = results[0].title;

  const movie = await prisma.movie.findUnique({ select: { id: true }, where: { title } });

  let movieId = movie?.id;

  if (!movieId) {
    ({ id: movieId } = await prisma.movie.create({
      data: {
        poster: results[0].poster_path,
        title: results[0].title,
      },
    }));
  }

  if (!movieId) {
    console.error(`TMDBで映画が見つかりませんでした：${title}`);
    return;
  }

  parseShowtimes(movieElement, movieId, day);
};

const parseShowtimes = async (movieElement: Element, movieId: number, day: Date) =>
  (
    await Promise.all(
      [...movieElement.querySelectorAll('.schedule-item .time span')].map(timeElement => parseShowtime(timeElement, movieId, day)),
    )
  ).flat();

const parseShowtime = async (timeElement: Element, movieId: number, day: Date) => {
  const endString = timeElement.nextSibling?.textContent?.trim();
  const startString = timeElement.textContent?.trim().replace('〜', '');

  if (!startString || !endString) {
    return [];
  }

  const [endHours, endMinutes] = endString.split(':');
  const [startHours, startMinutes] = startString.split(':');

  const end = setHours(setMinutes(setSeconds(day, 0), Number(endMinutes)), Number(endHours));
  const start = setHours(setMinutes(setSeconds(day, 0), Number(startMinutes)), Number(startHours));

  if (
    await prisma.showtime.findUnique({
      select: {
        id: true,
      },
      where: {
        cinemaId_movieId_start: {
          cinemaId: cinemas.gdcs.id,
          movieId,
          start,
        },
      },
    })
  ) {
    return [];
  }

  await prisma.showtime.create({
    data: {
      cinemaId: cinemas.gdcs.id,
      end,
      movieId,
      start,
    },
  });
};

const updateDocument = async (page: Page) => {
  global.document = new JSDOM(await page.content()).window.document;
};

const url = 'https://www.cinemasunshine.co.jp/theater/gdcs/';
const dayLocator = '.schedule-swiper__item:not(.active)';

const parsePage = async (page: Page) => {
  await updateDocument(page);

  const day = parseDay();

  if (!day) {
    return;
  }

  await parseMovies(day);
};

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);
    await parsePage(page);

    for (const day of await page.locator(dayLocator).all()) {
      await day.click();
      await parsePage(page);
    }

    await context.close();
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
