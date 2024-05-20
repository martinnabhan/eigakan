import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { Page } from '@eigakan/types/page';
import Link from 'next/link';

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
      include: {
        area: true,
        showtimes: {
          include: {
            cinema: {
              include: {
                area: true,
              },
            },
            movie: true,
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

const Cinemas: Page<typeof getServerSideProps> = ({ areas, cinemas, movies }) => (
  <PageLayout areas={areas} breadcrumbs={{ data: [{ name: title }], html: <p>{title}</p> }} cinemas={[]} movies={movies} title={title}>
    {({ defaults, params, query }) => (
      <div className="grid grid-cols-3 gap-5 lg:grid-cols-7">
        {cinemas
          .filter(({ showtimes }) => filterShowtimes({ defaults, params, showtimes }).length > 0)
          .map(({ name, slug }) => (
            <Link href={{ pathname: '/cinema/[slug]', query: { ...query, slug } }} key={slug}>
              {name}
            </Link>
          ))}
      </div>
    )}
  </PageLayout>
);

export { getServerSideProps };

export default Cinemas;
