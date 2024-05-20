import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Page } from '@eigakan/types/page';
import { validation } from '@eigakan/validation';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const getServerSideProps = cache(async params => {
  const id = validation.movieTitle.shape.movieId.safeParse(params?.id).data;

  if (!id) {
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
      id,
    },
  });

  if (!movie) {
    return {
      notFound: true,
    };
  }

  const [areas, cinemas] = await Promise.all([prisma.area.findMany(), prisma.cinema.findMany()]);

  return {
    props: {
      areas,
      cinemas,
      movie,
    },
    tags: new Set(['Movie']),
  };
});

const Movie: Page<typeof getServerSideProps> = ({ areas, cinemas, movie: { poster, ...movie } }) => {
  const router = useRouter();

  const defaults = getDefaults();
  const params = getParams(router.query);
  const showtimes = filterShowtimes({ defaults, params, showtimes: movie.showtimes });
  const title = `${movie.title}の上映時間`;

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
      areas={areas}
      breadcrumbs={{
        data: [{ item: '/search', name: '上映検索' }, { name: title }],
        html: [
          <Link href={{ pathname: '/search', query: router.query }} key="search">
            上映検索
          </Link>,
          <p key="title">{title}</p>,
        ],
      }}
      cinemas={cinemas}
      movies={[]}
      title={title}
    >
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-1/3 shrink-0 items-start gap-x-5 lg:sticky lg:top-48">
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

        <div className="flex flex-col gap-y-6 lg:w-3/4">
          {Object.entries(days).map(([day, dayShowtimes]) => (
            <div key={day}>
              <p className="mb-3 flex items-center gap-x-1">
                <CalendarDaysIcon className="mt-0.5 size-5" />
                {day}
              </p>

              <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
                {dayShowtimes.map(({ end, start }) => (
                  <a
                    className="rounded bg-amber-500 px-1 py-2 text-center font-semibold shadow lg:hover:shadow-lg"
                    href="/"
                    key={day + start}
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
