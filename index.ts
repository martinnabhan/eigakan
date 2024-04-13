import { setHours, setMinutes, setSeconds } from 'date-fns';
import { writeFile } from 'fs/promises';
import { JSDOM } from 'jsdom';
import { chromium } from 'playwright';

interface Movie {
  showtimes: Showtime[];
  title: string;
}

interface Showtime {
  area: string;
  cinema: string;
  end: Date;
  features: string[];
  start: Date;
}

const movies: Movie[] = [];

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.cinemasunshine.co.jp/theater/gdcs/');

    const { document } = new JSDOM(await page.content()).window;

    document.querySelectorAll('#tab1_content .content-item').forEach(contentItem => {
      const title = contentItem.querySelector('.title')?.textContent?.trim();

      if (!title) {
        return;
      }

      const showtimes: Showtime[] = [];

      contentItem.querySelectorAll('.schedule-item .time span').forEach(timeSpan => {
        const endString = timeSpan.nextSibling?.textContent?.trim();
        const startString = timeSpan.textContent?.trim().replace('〜', '');

        if (startString && endString) {
          const [endHours, endMinutes] = endString.split(':');
          const [startHours, startMinutes] = startString.split(':');

          const end = setHours(setMinutes(setSeconds(new Date(), 0), Number(endMinutes)), Number(endHours));
          const start = setHours(setMinutes(setSeconds(new Date(), 0), Number(startMinutes)), Number(startHours));

          showtimes.push({ area: '池袋', cinema: 'グランドシネマサンシャイン', end, features: [], start });
        }
      });

      const index = movies.findIndex(movie => movie.title === title);

      if (index !== -1) {
        movies[index].showtimes.push(...showtimes);
      } else {
        movies.push({
          showtimes,
          title,
        });
      }
    });

    // await page.locator('.schedule-swiper .swiper-slide').nth(1).click();

    await context.close();
    await browser.close();
    await writeFile(__dirname + '/movies.json', JSON.stringify(movies));
  } catch (error) {
    console.error(error);
  }
})();
