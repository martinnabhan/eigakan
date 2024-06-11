import { MoviePosterLink } from '@eigakan/components/MoviePosterLink';
import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { defaultArgs } from '@eigakan/lib/defaultArgs';
import { filterShowtimes } from '@eigakan/lib/filterShowtimes';
import { Page } from '@eigakan/types/page';

const title = '映画検索';

const getServerSideProps = cache(async () => {
  const [areas, cinemas, movies] = await Promise.all([
    prisma.area.findMany({ ...defaultArgs, select: { label: true, slug: true } }),
    prisma.cinema.findMany({ ...defaultArgs, select: { area: { select: { label: true } }, name: true, slug: true } }),
    prisma.movie.findMany({
      ...defaultArgs,
      select: {
        id: true,
        poster: true,
        showtimes: {
          select: {
            areaSlug: true,
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
    }),
  ]);

  return {
    props: {
      areas,
      cinemas,
      movies,
    },
    tags: new Set(['Area', 'Cinema', 'Movie']),
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
