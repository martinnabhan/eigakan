import { Button } from '@eigakan/components/Button';
import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { defaultArgs } from '@eigakan/lib/defaultArgs';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Page } from '@eigakan/types/page';
import { validation } from '@eigakan/validation';
import { MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { format, isAfter, isBefore } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/router';

const getServerSideProps = cache(async params => {
  const id = validation.movie.shape.id.safeParse(Number(params?.id)).data;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const movie = await prisma.movie.findUnique({
    select: {
      id: true,
      poster: true,
      showtimes: {
        orderBy: {
          start: 'asc',
        },
        select: {
          area: {
            select: {
              label: true,
            },
          },
          areaSlug: true,
          cinema: {
            select: {
              name: true,
            },
          },
          cinemaSlug: true,
          end: true,
          id: true,
          movieId: true,
          start: true,
          valid: true,
        },
        where: {
          start: {
            gt: new Date(),
          },
        },
      },
      title: true,
    },
    where: {
      id,
      showtimes: {
        some: {
          start: {
            gt: new Date(),
          },
        },
      },
    },
  });

  if (!movie) {
    return {
      notFound: true,
    };
  }

  const [areas, cinemas] = await Promise.all([
    prisma.area.findMany({ ...defaultArgs, select: { label: true, slug: true } }),
    prisma.cinema.findMany({ ...defaultArgs, select: { area: { select: { label: true } }, name: true, slug: true } }),
  ]);

  return {
    props: {
      areas,
      cinemas,
      movie,
    },
    tags: new Set(['Area', 'Cinema', 'Movie']),
  };
});

const Movie: Page<typeof getServerSideProps> = ({ areas, cinemas, movie: { poster, ...movie } }) => {
  const router = useRouter();

  const defaults = getDefaults();
  const params = getParams(router.query);
  const showtimes = filterShowtimes({ defaults, params, showtimes: movie.showtimes });
  const title = `${movie.title}の上映一覧`;

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
      breadcrumbs={[{ href: '/showtimes', label: '上映検索' }, { label: title }]}
      cinemas={cinemas}
      movies={[]}
      title={title}
    >
      <div className="relative flex flex-col gap-8">
        <Image
          alt=""
          className="rounded-xl border-2 border-white shadow"
          height={300}
          priority
          src={`https://image.tmdb.org/t/p/w300${poster}`}
          width={185}
        />

        <div className="flex flex-col gap-y-6">
          {Object.entries(days).map(([day, dayShowtimes]) => (
            <div key={day}>
              <p className="mb-3 flex items-center gap-x-1 text-lg font-semibold">
                <CalendarDaysIcon className="size-5" />
                {day}
              </p>

              <div className="grid gap-3 lg:grid-cols-4">
                {dayShowtimes.map(({ area, cinema, end, id, start, valid }) => (
                  // TODO: use cinema
                  <a
                    href={`https://transaction.ticket-cinemasunshine.com/projects/sskts-production/purchase/transaction/${id}`}
                    key={day + start}
                    target="_blank"
                  >
                    <Button
                      className="flex !h-auto w-full flex-col py-3"
                      disabled={!isAfter(new Date(), valid) || !isBefore(new Date(), end)}
                      loading={false}
                    >
                      <p className="mb-2 text-xl font-semibold">
                        {format(start, 'HH:mm')}〜{format(end, 'HH:mm')}
                      </p>

                      <p className="mr-auto flex items-center gap-x-1 font-normal text-white/70">
                        <VideoCameraIcon className="size-4" />
                        <span className="line-clamp-1">{cinema.name}</span>
                      </p>

                      <p className="mr-auto flex items-center gap-x-1 font-normal text-white/70">
                        <MapPinIcon className="-ml-px size-4" />
                        {area.label}
                      </p>
                    </Button>
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
