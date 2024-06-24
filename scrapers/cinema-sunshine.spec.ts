import { prisma } from '@eigakan/db';
import { test } from '@playwright/test';
import { Movie, MovieTitle } from '@prisma/client';
import { parse, setHours, setMinutes, setSeconds } from 'date-fns';
import { BrowserContext, Locator, chromium } from 'playwright';

// const featureMap = {
//   '4Kレストア版': '4Kレストア版',
//   'BESTIA enhanced': 'BESTIA',
//   'Dolby Atmos': 'Dolby Atmos',
//   PG12: 'PG12',
//   'R15+': 'R15+',
//   // TODO: '午前十時の映画祭14『インディ・ジョーンズ／魔宮の伝説』',
//   '【4DXSCREEN字幕版】': '4DXSCREEN', // TODO: 字幕？
//   '【4DX版】': '4DX',
//   '【IMAXレーザーGT字幕版】': 'IMAX', // TODO: 字幕？
//   '【IMAXレーザーGT版】': 'IMAX',
//   '【吹替版】': '吹替版',
//   '【字幕版】': '字幕版',
//   製作70周年: '製作70周年',
// };

const url = 'https://www.cinemasunshine.co.jp';

const parseCinema = async (
  context: BrowserContext,
  link: Locator,
  movie: Pick<Movie, 'id' | 'title'>,
  movieTitle: Pick<MovieTitle, 'title'>,
) => {
  const name = ((await link.textContent()) || '').trim();

  if (!name) {
    throw new Error('映画館の名前を取得できませんでした。');
  }

  if (name === '4DX' || name === 'IMAX' || name === 'SCREEN X' || name === 'ULTRA 4DX') {
    return;
  }

  const cinemaName = await prisma.cinemaName.findUnique({
    select: {
      cinema: {
        select: {
          areaSlug: true,
          slug: true,
        },
      },
    },
    where: {
      name,
    },
  });

  if (!cinemaName) {
    await prisma.cinemaName.create({ data: { name } });
    console.info(`新しい映画館名を作成しました：「${name}」`);
    return;
  }

  if (!cinemaName.cinema) {
    console.info(`映画館が不明のためにスキップしました：「${name}」`);
    return;
  }

  const href = await link.getAttribute('href');

  if (!href) {
    throw new Error(`映画館のhrefを取得できませんでした：「${name}」`);
  }

  console.info(`映画館を処理中：${name}`);

  const page = await context.newPage();

  await page.goto(url + href);

  // たまにポップアップが表示されるため
  if (await page.isVisible('#check-close-btn')) {
    page.locator('#check-close-btn').click();
  }

  for (const dayButton of await page.locator('.schedule-swiper__item').all()) {
    await dayButton.click();

    const dayString = await dayButton.locator('.day').innerHTML();
    const day = parse(dayString, 'MM/dd', new Date());

    for (const title of await page.locator('#tab1_content .content-item').getByText(movie.title).all()) {
      for (const time of await title.locator('..').locator('..').locator('.schedule-item .time').all()) {
        const timeString = (await time.textContent())?.replace(/\s/g, '');

        if (!timeString) {
          throw new Error('映画の上映時間を取得できませんでした。');
        }

        const [startString, endString] = timeString.replace(/\s/g, '').split('〜');

        const [endHours, endMinutes] = endString.split(':');
        const [startHours, startMinutes] = startString.split(':');

        const end = setHours(setMinutes(setSeconds(day, 0), Number(endMinutes)), Number(endHours));
        const start = setHours(setMinutes(setSeconds(day, 0), Number(startMinutes)), Number(startHours));

        if (
          (await prisma.showtime.count({
            where: {
              cinemaSlug: cinemaName.cinema.slug,
              movieId: movie.id,
              start,
            },
          })) !== 0
        ) {
          console.info(`スキップ：${cinemaName.cinema.slug}、${movie.id}、${start}`);
          continue;
        }

        console.info(`作成：${cinemaName.cinema.slug}、${movie.id}、${start}`);

        await prisma.showtime.create({
          // @ts-expect-error 未対応
          data: {
            areaSlug: cinemaName.cinema.areaSlug,
            cinemaSlug: cinemaName.cinema.slug,
            end,
            movieId: movie.id,
            movieTitleTitle: movieTitle.title,
            start,
          },
        });
      }
    }
  }

  await page.close();
};

const parseMovie = async (context: BrowserContext, link: Locator) => {
  const title = await link.locator('.movie__title').textContent();

  if (!title) {
    throw new Error('映画のタイトルを取得できませんでした。');
  }

  const movieTitle = await prisma.movieTitle.findUnique({ select: { movieId: true, title: true }, where: { title } });

  if (!movieTitle) {
    await prisma.movieTitle.create({ data: { title } });
    console.info(`新しい映画タイトルを作成しました：「${title}」`);
    return;
  }

  if (!movieTitle.movieId) {
    console.info(`映画が不明のためにスキップしました：「${title}」`);
    return;
  }

  const href = await link.getAttribute('href');

  if (!href) {
    throw new Error(`映画のhrefを取得できませんでした：「${title}」`);
  }

  console.info(`映画を処理中：「${title}」`);

  const page = await context.newPage();

  await page.goto(url + href);

  for (const cinemaLink of await page.locator('.theaterlink-box .link').all()) {
    await parseCinema(context, cinemaLink, { id: movieTitle.movieId, title }, movieTitle);
  }
};

test('cinema-sunshine', async ({ context, page }) => {
  try {
    const browser = await chromium.launch();

    await page.goto(url);

    const button = page.locator('.movie__more__pc');

    let count = await page.locator('.movie__list').count();

    await button.click();

    while (count !== (await page.locator('.movie__list').count())) {
      count = await page.locator('.movie__list').count();
      await button.click();
    }

    for (const movieLink of await page.locator('.movie__link').all()) {
      await parseMovie(context, movieLink);
    }

    await context.close();
    await browser.close();
  } catch (error) {
    console.error(error);
  }
});
