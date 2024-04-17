import { Checkbox } from '@eigakan/components/Checkbox';
import { Movie } from '@eigakan/components/Movie';
import { SidebarSection } from '@eigakan/components/SidebarSection';
import { prisma } from '@eigakan/db';
import { areas } from '@eigakan/lib/areas';
import { cinemas } from '@eigakan/lib/cinemas';
import { Prisma } from '@prisma/client';
import { addWeeks, endOfDay, format, startOfDay } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

interface Props {
  movies: Prisma.MovieGetPayload<{ include: { showtimes: true } }>[];
}

const Search: NextPage<Props> = ({ movies }) => {
  const router = useRouter();

  const params: {
    area: string[];
    cinema: string[];
    dateEnd?: string;
    dateStart?: string;
    movie?: string;
    timeEnd?: string;
    timeStart?: string;
  } = {
    area: [],
    cinema: [],
  };

  const setArrayValue = (
    key: Exclude<keyof typeof params, 'dateEnd' | 'dateStart' | 'dateEnd' | 'movie' | 'timeEnd' | 'timeStart'>,
    value: string | string[] | undefined,
  ) => {
    if (value) {
      params[key] = typeof value === 'string' ? [value] : value;
    }
  };

  const setValue = (key: Exclude<keyof typeof params, 'area' | 'cinema'>, value: string | string[] | undefined) => {
    if (typeof value === 'string') {
      params[key] = value;
    }
  };

  const handlers: Record<keyof typeof params, (query: ParsedUrlQuery) => void> = {
    area: query => setArrayValue('area', query['area']),
    cinema: query => setArrayValue('cinema', query['cinema']),
    dateEnd: query => setValue('dateEnd', query['dateEnd']),
    dateStart: query => setValue('dateStart', query['dateStart']),
    movie: query => setValue('movie', query['movie']),
    timeEnd: query => setValue('timeEnd', query['timeEnd']),
    timeStart: query => setValue('timeStart', query['timeStart']),
  };

  Object.values(handlers).forEach(handler => handler(router.query));

  const defaultDateEnd = format(endOfDay(addWeeks(new Date(), 1)), 'yyyy-MM-dd');
  const defaultDateStart = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const defaultTimeEnd = '00:00';
  const defaultTimeStart = '00:00';
  const movie = params.movie && movies.find(({ id }) => id === Number(params.movie));
  const now = new Date();

  return (
    <div className="container flex flex-col gap-y-6">
      <h1 className="text-4xl font-bold">上映検索</h1>

      <div className="flex gap-x-8 py-12">
        <div className="w-1/5 shrink-0 divide-y divide-gray-300">
          <SidebarSection title="エリア">
            {Object.entries(areas).map(([slug, { label }]) => (
              <Link
                key={slug}
                href={{
                  pathname: '/search',
                  query: {
                    ...params,
                    area: params.area.includes(slug) ? params.area.filter(existingSlug => existingSlug !== slug) : [...params.area, slug],
                  },
                }}
                shallow
              >
                <Checkbox checked={params.area.includes(slug)}>{label}</Checkbox>
              </Link>
            ))}
          </SidebarSection>

          <SidebarSection title="映画館">
            {Object.entries(cinemas).map(([slug, { label }]) => (
              <Link
                key={slug}
                href={{
                  pathname: '/search',
                  query: {
                    ...params,
                    cinema: params.cinema.includes(slug)
                      ? params.cinema.filter(existingSlug => existingSlug !== slug)
                      : [...params.cinema, slug],
                  },
                }}
                shallow
              >
                <Checkbox checked={params.cinema.includes(slug)}>{label}</Checkbox>
              </Link>
            ))}
          </SidebarSection>

          <SidebarSection title="日付">
            <input
              type="date"
              min={format(now, 'yyyy-MM-dd')}
              onChange={({ target }) => router.push({ pathname: '/search', query: { ...params, dateStart: target.value } })}
              value={params.dateStart || defaultDateStart}
            />
            <input
              type="date"
              onChange={({ target }) => router.push({ pathname: '/search', query: { ...params, dateEnd: target.value } })}
              value={params.dateEnd || defaultDateEnd}
            />
          </SidebarSection>

          <SidebarSection title="時間">
            <input
              type="time"
              onChange={({ target }) => router.push({ pathname: '/search', query: { ...params, timeStart: target.value } })}
              value={params.timeStart || defaultTimeStart}
            />
            <input
              type="time"
              onChange={({ target }) => {
                if (target.value === defaultTimeEnd) {
                  delete params.timeEnd;
                  router.push({ pathname: '/search', query: params });
                } else {
                  router.push({ pathname: '/search', query: { ...params, timeEnd: target.value } });
                }
              }}
              value={params.timeEnd || defaultTimeEnd}
            />
          </SidebarSection>
        </div>

        {movie ? (
          <Movie {...movie} />
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {movies.map(({ id, poster, title }) => (
              <Link
                className="flex h-44 overflow-hidden rounded shadow lg:hover:shadow-md"
                key={title}
                href={{ pathname: '/search', query: { ...params, movie: id } }}
                shallow
              >
                {poster && (
                  <Image alt="" className="w-2/5 shrink-0" height={300} src={`https://image.tmdb.org/t/p/w185${poster}`} width={185} />
                )}

                <div className="w-full rounded-r border border-l-0 border-gray-300 p-1">
                  <p className="font-medium">{title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: {
    movies: await prisma.movie.findMany({
      include: {
        showtimes: {
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
      orderBy: {
        showtimes: {
          _count: 'desc',
        },
      },
    }),
  },
});

export { getServerSideProps };

export default Search;
