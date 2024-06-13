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
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
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
          movieId: true,
          start: true,
        },
        where: {
          start: {
            gte: new Date(),
          },
        },
      },
      title: true,
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
      breadcrumbs={{
        data: [{ item: '/movies', name: '映画検索' }, { name: title }],
        html: [
          <Link href={{ pathname: '/movies', query: router.query }} key="movies">
            映画検索
          </Link>,
          <p key="title">{title}</p>,
        ],
      }}
      cinemas={cinemas}
      movies={[]}
      title={title}
    >
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-1/3 shrink-0 flex-col gap-y-5 lg:sticky lg:top-36">
          <div className="flex items-start gap-x-5">
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
                <CalendarDaysIcon className="size-5" />
                <p>2024/02/13</p>
              </div>
            </div>
          </div>

          <p>
            テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
          </p>
        </div>

        <div className="flex flex-col gap-y-6 lg:w-2/3">
          {Object.entries(days).map(([day, dayShowtimes]) => (
            <div key={day}>
              <p className="mb-3 flex items-center gap-x-1 text-lg font-semibold">
                <CalendarDaysIcon className="size-5" />
                {day}
              </p>

              <div className="grid gap-3 lg:grid-cols-3">
                {dayShowtimes.map(({ area, cinema, end, start }) => (
                  <a href="/" key={day + start} target="_blank">
                    <Button className="flex !h-auto w-full flex-col py-2" disabled={false} loading={false}>
                      <p className="text-lg font-semibold">
                        {format(start, 'HH:mm')}〜{format(end, 'HH:mm')}
                      </p>

                      <p className="flex items-center gap-x-1">
                        <VideoCameraIcon className="size-4" />
                        {cinema.name}
                      </p>

                      <p className="flex items-center gap-x-1">
                        <MapPinIcon className="size-4" />
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
