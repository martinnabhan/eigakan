import { Heading } from '@eigakan/components/Heading';
import { Section } from '@eigakan/components/Section';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { Page } from '@eigakan/types/page';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { FilmIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

const getServerSideProps = cache(async () => {
  const [areas, showtimes, cinemas, movies] = await Promise.all([
    prisma.area.findMany({
      where: {
        cinemas: {
          some: {
            showtimes: {
              some: {
                start: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    }),
    prisma.showtime.findMany({
      select: {
        cinema: {
          select: {
            areaId: true,
          },
        },
      },
      where: {
        start: {
          gte: new Date(),
        },
      },
    }),
    prisma.cinema.findMany({
      orderBy: {
        showtimes: {
          _count: 'desc',
        },
      },
      where: {
        showtimes: {
          some: {
            start: {
              gte: new Date(),
            },
          },
        },
      },
    }),
    prisma.movie.findMany({
      orderBy: {
        showtimes: {
          _count: 'desc',
        },
      },
      where: {
        showtimes: {
          some: {
            start: {
              gte: new Date(),
            },
          },
        },
      },
    }),
  ]);

  const areasWithCount = areas.map(area => ({ ...area, count: 0 }));

  showtimes.forEach(({ cinema }) => {
    const index = areasWithCount.findIndex(({ id }) => id === cinema.areaId);

    areasWithCount[index].count += 1;
  });

  return {
    props: {
      areas: areasWithCount.sort((a, b) => (a.count > b.count ? -1 : 1)).map(({ count: _count, ...area }) => area),
      cinemas,
      movies,
    },
    // TODO: tags
    tags: new Set(['Movie']),
  };
});

const Index: Page<typeof getServerSideProps> = ({ areas, cinemas, movies }) => (
  <div className="py-10 pb-32 lg:py-0 lg:pb-80">
    <div className="container flex flex-col">
      <div className="mb-32 grid gap-y-14 lg:mb-0 lg:min-h-screen lg:grid-cols-2 lg:gap-x-10">
        <div className="flex flex-col items-start justify-center">
          <p className="mb-24 lg:mb-2">映画館.com</p>

          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
            人気映画の上映を
            <br />
            簡単に探す
          </h1>

          <p className="mb-10 font-light leading-loose text-red-200 lg:text-lg">
            映画館ドットコムは人気映画の上映をエリア、映画、映画館、
            <br className="hidden lg:block" />
            日付と時間で簡単に検索できるサイトです。
          </p>

          <div className="flex items-center gap-x-5">
            <Link
              className="flex items-center gap-x-1 rounded-md bg-amber-500 px-5 py-3 text-sm font-medium shadow lg:hover:shadow-md lg:active:shadow-inner"
              href="/search"
            >
              上映を探す
              <MagnifyingGlassIcon className="size-6" />
            </Link>

            <a
              className="flex items-center gap-x-1 text-sm font-medium"
              href="#search"
              onClick={event => {
                event.preventDefault();
                document.querySelector('#search')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              もっとみる
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="flex grow items-center justify-center">
          <div className="grid grid-cols-3 gap-4 lg:gap-5">
            {movies.slice(0, 6).map(({ id, poster, title }) => (
              <Link
                key={id}
                className="relative overflow-hidden rounded-xl shadow lg:hover:shadow-md lg:active:shadow-inner"
                href={{ pathname: '/search', query: { movie: id } }}
              >
                <Image
                  alt={title}
                  className="h-full rounded-xl border-2 border-white object-cover"
                  height={225}
                  priority
                  src={`https://image.tmdb.org/t/p/w300${poster}`}
                  width={150}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Heading
        heading="簡単に検索"
        id="search"
        text={
          <>
            映画館ドットコムは他のサイトより簡単に好きな条件で上映時間を検索できます。
            <br />
            あなたは何で検索しますか？
          </>
        }
        title="エリア、映画、映画館で簡単に検索"
      />

      <div className="grid w-full gap-x-5 gap-y-16 lg:mb-56 lg:grid-cols-3 lg:gap-y-0">
        <Section Icon={MapPinIcon} title="人気エリアから探す">
          {areas.map(({ id, label, slug }) => (
            <Link key={id} className="line-clamp-1" href={{ pathname: '/area/[slug]', query: { slug } }}>
              {label}
            </Link>
          ))}
        </Section>

        <Section Icon={FilmIcon} title="上映中の人気映画から探す">
          {movies.map(({ id, title }) => (
            <Link key={id} className="line-clamp-1" href={{ pathname: '/movie', query: { id } }}>
              {title}
            </Link>
          ))}
        </Section>

        <Section Icon={VideoCameraIcon} title="人気映画館から探す">
          {cinemas.map(({ id, label, slug }) => (
            <Link key={id} className="line-clamp-1" href={{ pathname: '/cinema', query: { slug } }}>
              {label}
            </Link>
          ))}
        </Section>
      </div>
    </div>
  </div>
);

//      <Heading
//        heading="豊かな機能"
//        text={
//          <>
//            会員登録すれば多くの便利な機能が使えるようになります。
//            <br />
//            会員登録してみませんか？
//          </>
//        }
//        title="会員には便利な機能が多い"
//      />
//
//      <div className="mb-56 grid w-full grid-cols-3 gap-5">
//        <Section Icon={MapPinIcon} title="機能１">
//          とても便利
//        </Section>
//
//        <Section Icon={MapPinIcon} title="機能２">
//          とても便利
//        </Section>
//
//        <Section Icon={MapPinIcon} title="機能３">
//          とても便利
//        </Section>
//
//        <Section Icon={MapPinIcon} title="機能４">
//          とても便利
//        </Section>
//
//        <Section Icon={MapPinIcon} title="機能５">
//          とても便利
//        </Section>
//
//        <Section Icon={MapPinIcon} title="機能６">
//          とても便利
//        </Section>
//      </div>

// <div>
//   <h2>日付から探す</h2>
//
//   <ClientSide>
//     {(() => {
//       const today = new Date();
//       const todayString = format(today, 'yyyy-MM-dd');
//       const tomorrow = addDays(today, 1);
//       const tomorrowString = format(tomorrow, 'yyyy-MM-dd');
//
//       return (
//         <>
//           <Link href={{ pathname: '/search', query: { dateEnd: todayString, dateStart: todayString } }}>今日</Link>
//           <Link href={{ pathname: '/search', query: { dateEnd: tomorrowString, dateStart: tomorrowString } }}>明日</Link>
//           <Link href={{ pathname: '/search', query: { dateEnd: format(addDays(today, 7), 'yyyy-MM-dd'), dateStart: todayString } }}>
//             今週
//           </Link>
//         </>
//       );
//     })()}
//   </ClientSide>
// </div>

export { getServerSideProps };

export default Index;
