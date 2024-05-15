import { MoviePosterLink } from '@eigakan/components/MoviePosterLink';
import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Page } from '@eigakan/types/page';
import { useRouter } from 'next/router';

const title = '上映検索';

const getServerSideProps = cache(async () => {
  const [areas, cinemas, movies] = await Promise.all([
    prisma.area.findMany(),
    prisma.cinema.findMany(),
    prisma.movie.findMany({
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
      orderBy: {
        showtimes: {
          _count: 'desc',
        },
      },
    }),
  ]);

  return {
    props: {
      areas,
      cinemas,
      movies,
    },
    // TODO: tags
    tags: new Set(['Movie']),
  };
});

const Search: Page<typeof getServerSideProps> = ({ areas, cinemas, ...props }) => {
  const router = useRouter();

  const defaults = getDefaults();
  const params = getParams(router.query);

  const movies = props.movies.flatMap(movie => {
    const showtimes = filterShowtimes({ defaults, params, showtimes: movie.showtimes });

    if (showtimes.length === 0) {
      return [];
    }

    return { ...movie, showtimes };
  });

  return (
    <PageLayout areas={areas} cinemas={cinemas} breadcrumbs={{ data: [{ name: title }], html: <p>{title}</p> }} title={title}>
      <div className="grid grid-cols-7 gap-5">
        {movies.map((movie, index) => (
          <MoviePosterLink key={movie.id} {...movie} priority={index <= 10} />
        ))}
      </div>
    </PageLayout>
  );
};

export { getServerSideProps };

export default Search;
