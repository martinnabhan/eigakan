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
import { useState } from 'react';

interface Props {
  movies: Prisma.MovieGetPayload<{ include: { showtimes: true } }>[];
}

const Search: NextPage<Props> = ({ movies }) => {
  const router = useRouter();

  const [dateEnd, setDateEnd] = useState(format(endOfDay(addWeeks(new Date(), 1)), 'yyyy-MM-dd'));
  const [dateStart, setDateStart] = useState(format(startOfDay(new Date()), 'yyyy-MM-dd'));
  const [selectedAreaSlugs, setSelectedAreaSlugs] = useState<string[]>([]);
  const [selectedCinemaSlugs, setSelectedCinemaSlugs] = useState<string[]>([]);
  const [timeEnd, setTimeEnd] = useState(format(endOfDay(addWeeks(new Date(), 1)), 'HH:mm'));
  const [timeStart, setTimeStart] = useState(format(startOfDay(new Date()), 'HH:mm'));

  const movie = typeof router.query.title === 'string' && movies.find(movie => movie.title === router.query.title);

  if (movie) {
    return <Movie {...movie} />;
  }

  return (
    <>
      <h1 className="py-12 text-4xl font-bold">上映中映画一覧</h1>

      <div className="flex gap-x-8 py-12">
        <div className="w-1/5 shrink-0 divide-y divide-gray-300">
          <SidebarSection title="エリア">
            {Object.entries(areas).map(([slug, { label }]) => (
              <Checkbox
                checked={selectedAreaSlugs.includes(slug)}
                key={slug}
                onChange={() =>
                  setSelectedAreaSlugs(slugs => (slugs.includes(slug) ? slugs.filter(oldSlug => oldSlug !== slug) : [...slugs, slug]))
                }
              >
                {label}
              </Checkbox>
            ))}
          </SidebarSection>

          <SidebarSection title="映画館">
            {Object.entries(cinemas).map(([slug, { label }]) => (
              <Checkbox
                checked={selectedCinemaSlugs.includes(slug)}
                key={slug}
                onChange={() =>
                  setSelectedCinemaSlugs(slugs => (slugs.includes(slug) ? slugs.filter(oldSlug => oldSlug !== slug) : [...slugs, slug]))
                }
              >
                {label}
              </Checkbox>
            ))}
          </SidebarSection>

          <SidebarSection title="日付">
            <input type="date" onChange={({ target }) => setDateStart(target.value)} value={dateStart} />
            <input type="date" onChange={({ target }) => setDateEnd(target.value)} value={dateEnd} />
          </SidebarSection>

          <SidebarSection title="時間">
            <input type="time" onChange={({ target }) => setTimeStart(target.value)} value={timeStart} />
            <input type="time" onChange={({ target }) => setTimeEnd(target.value)} value={timeEnd} />
          </SidebarSection>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {movies.map(({ poster, title }) => (
            <Link className="flex h-44 overflow-hidden rounded shadow lg:hover:shadow-md" key={title} href={`?title=${title}`} shallow>
              {poster && (
                <Image alt="" className="w-2/5 shrink-0" height={300} src={`https://image.tmdb.org/t/p/w185${poster}`} width={185} />
              )}

              <div className="w-full rounded-r border border-l-0 border-gray-300 p-1">
                <p className="font-medium">{title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  console.log(query);

  return {
    props: {
      movies: await prisma.movie.findMany({
        include: { showtimes: { orderBy: { start: 'asc' } } },
        orderBy: { showtimes: { _count: 'desc' } },
        ...(Array.isArray(query.search) && query.search[0] === 'cinema' && {
          where: {
            showtimes: {
              some: {
                cinema: {
                  slug: {
                    in: query.search[1].split(','),
                  },
                },
              },
            },
          },
        }),
      }),
    },
  };
};

export { getServerSideProps };

export default Search;
