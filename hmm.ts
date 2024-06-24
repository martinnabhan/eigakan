import { prisma } from '@eigakan/db';

// 002: heiwajima 平和島
// 006: numazu 沼津
// 008: kinuyama 衣山
// 009: shigenobu 重信
// 012: kitajima 北島
// 013: tsuchiura 土浦
// 014: kahoku かほく
// 015: masaki エミフルMASAKI
// 016: yamatokoriyama 大和郡山
// 017: shimonoseki 下関
// 018: aira 姶良
// 019: yukarigaoka ユーカリが丘
// 020: gdcs グランドシネマサンシャイン 池袋
// 021: lalaportnumazu ららぽーと沼津
// 022: izuka 飯塚
// 032: sapporo サツゲキ
// 033: tomakomai ディノスシネマズ 苫小牧
// 034: muroran ディノスシネマズ 室蘭

const baseUrl = 'https://www.cinemasunshine.co.jp/schedule/data';
const version = new Date().toISOString();

const main = async () => {
  const response = await fetch(`${baseUrl}/schedule.json?v=${version}`);
  const schedule: Record<string, Record<string, Record<string, unknown>>> = await response.json();

  for (const [movieId, branches] of Object.entries(schedule)) {
    for (const [branchId, dates] of Object.entries(branches)) {
      // TODO: where branchCode
      const cinema = await prisma.cinema.findUnique({ select: { areaSlug: true, slug: true }, where: { slug: '' } });

      if (!cinema) {
        continue;
      }

      await Promise.all(
        Object.keys(dates).map(async date => {
          const dateResponse = await fetch(`${baseUrl}/${movieId}/${branchId}/${date}.json?v=${version}`);

          const json: Record<
            string,
            Record<
              string,
              {
                endDate: string;
                id: string;
                name: { ja: string };
                offers: { validFrom: string; validFromForMembers: string };
                startDate: string;
              }
            >
          > = await dateResponse.json();

          return Promise.all(
            Object.values(json).map(async showtimeWrapper => {
              const { endDate, id, name, offers, startDate } = Object.values(showtimeWrapper)[0];

              const movieTitle = await prisma.movieTitle.upsert({
                create: { title: name.ja },
                select: { movieId: true },
                update: { title: name.ja },
                where: { title: name.ja },
              });

              // TODO: url
              const create = {
                areaSlug: cinema.areaSlug,
                cinemaSlug: cinema.slug,
                end: new Date(endDate),
                id,
                movieId: movieTitle.movieId,
                movieTitleTitle: name.ja,
                start: new Date(startDate),
                valid: new Date(offers.validFrom),
                validForMembers: new Date(offers.validFromForMembers),
              };

              console.info(create);

              return prisma.showtime.upsert({
                create,
                update: {},
                where: {
                  id,
                },
              });
            }),
          );
        }),
      );
    }
  }

  // TODO: exit?
  process.exit();
};

main();
