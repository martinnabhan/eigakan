import { MoviePosterLink } from '@eigakan/components/MoviePosterLink';
import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { Page } from '@eigakan/types/page';

const title = '映画検索';

const getServerSideProps = cache(async () => {
  const [areas, cinemas, movies] = await Promise.all([
    prisma.area.findMany({
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
    prisma.cinema.findMany({
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

const Movies: Page<typeof getServerSideProps> = ({ areas, cinemas, movies }) => (
  <PageLayout areas={areas} breadcrumbs={{ data: [{ name: title }], html: <p>{title}</p> }} cinemas={cinemas} movies={[]} title={title}>
    {({ defaults, params }) => (
      <div className="grid grid-cols-3 gap-5 lg:grid-cols-7">
        {movies
          .filter(({ showtimes }) => filterShowtimes({ defaults, params, showtimes }).length > 0)
          .map(movie => (
            <MoviePosterLink key={movie.id} {...movie} />
          ))}
      </div>
    )}
  </PageLayout>
);

export { getServerSideProps };

export default Movies;
