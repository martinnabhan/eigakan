import { PageLayout } from '@eigakan/components/PageLayout';
import { Sidebar } from '@eigakan/components/Sidebar';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Page } from '@eigakan/types/page';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const getServerSideProps = cache(async params => {
  if (typeof params?.id !== 'string' || !Number.isInteger(Number(params.id))) {
    return {
      notFound: true,
    };
  }

  const movie = await prisma.movie.findUnique({
    include: {
      showtimes: {
        include: {
          cinema: {
            include: {
              area: true,
            },
          },
        },
        orderBy: {
          start: 'asc',
        },
        where: {
          start: {
            gte: new Date(),
          },
        },
      },
    },
    where: {
      id: Number(params.id),
    },
  });

  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      movie,
    },
    tags: new Set(['Movie']),
  };
});

const Movie: Page<typeof getServerSideProps> = ({ movie: { poster, ...movie } }) => {
  const router = useRouter();

  const defaults = getDefaults();
  const params = getParams(router.query);
  const showtimes = filterShowtimes({ defaults, params, showtimes: movie.showtimes });
  const title = `映画「${movie.title}」の上映時間`;

  const days: { [key: string]: typeof showtimes } = {};

  for (const showtime of showtimes) {
    const day = format(showtime.start, 'MM/dd（E）', { locale: ja });

    if (!(day in days)) {
      days[day] = [];
    }

    days[day].push(showtime);
  }

  return (
    <PageLayout
      breadcrumbs={{
        data: [{ item: '/search', name: '上映検索' }, { name: title }],
        html: [<Link href={{ pathname: '/search', query: router.query }}>上映検索</Link>, <p>{title}</p>],
      }}
      title={title}
    >
      <div className="flex gap-x-5">
        <div className="flex gap-x-5 shrink-0 w-1/3 items-start">
          {poster && (
            <Image
              alt=""
              className="shrink-0 rounded-xl border-2 border-white shadow"
              height={300}
              priority
              src={`https://image.tmdb.org/t/p/w300${poster}`}
              width={185}
            />
          )}

          <div>
            <div className="flex items-center gap-x-2">
              <CalendarDaysIcon className="mt-0.5 size-4" />
              <p>2024/02/13</p>
            </div>
          </div>
        </div>

        <div className="w-3/4 flex flex-col gap-y-6">
          {Object.entries(days).map(([day, showtimes]) => (
            <div key={day}>
              <p className="mb-3 flex items-center gap-x-1">
                <CalendarDaysIcon className="mt-0.5 size-5" />
                {day}
              </p>

              <div className="grid grid-cols-4 gap-3">
                {showtimes.map(({ end, start }) => (
                  <a
                    key={day + start}
                    className="rounded bg-amber-500 px-1 py-2 text-center font-semibold shadow lg:hover:shadow-lg"
                    href="/"
                    target="_blank"
                  >
                    {format(start, 'HH:mm')}〜{format(end, 'HH:mm')}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export { getServerSideProps };

export default Movie;
