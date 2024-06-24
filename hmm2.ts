// curl -X POST https://hlo.tohotheater.jp/net/ticket/081/TNPI2040J03.do -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" -d "site_cd=081&jyoei_date=20240621&gekijyo_cd=0811&screen_cd=30&sakuhin_cd=024026&pf_no=7&fnc=1&pageid=2000J01" | iconv -f SJIS -t UTF8

// site_cd=081
// jyoei_date=20240621
// gekijyo_cd=0811 theathercd
// screen_cd=30 code
// sakuhin_cd=024026

// 固定？
// pf_no=7
// fnc=1
// pageid=2000J01

const main = async () => {
  // TODO: get every cinema id
  // TODO: select branchCode
  const cinemas = await prisma!.cinema.findMany({ select: { slug: true } });

  for (const { slug } of cinemas) {
    const datesResponse = await fetch(
      `https://hlo.tohotheater.jp/net/schedule/${slug}/TNPI3050J03.do?__type__=html&__useResultInfo__=no&vg_cd=${slug}&show_day=20240621&term=99`,
    );

    const jsonDates = (await datesResponse.json()) as Record<string, { date: string }>;

    const dates: string[] = [];

    Object.values(jsonDates).forEach(({ date }) => dates.push(date));

    for (const date of dates) {
      const dateResponse = await fetch(
        `https://hlo.tohotheater.jp/net/schedule/${slug}/TNPI3050J02.do?__type__=html&__useResultInfo__=no&vg_cd=${slug}&show_day=${date}`,
      );

      console.log(await dateResponse.json());
    }
  }

  process.exit();
};

main();
