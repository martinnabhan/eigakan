import { MoviePosterLink } from '@eigakan/components/MoviePosterLink';
import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { Page } from '@eigakan/types/page';

const getServerSideProps = cache(async params => {
  if (typeof params?.slug !== 'string') {
    return {
      notFound: true,
    };
  }

  const cinema = await prisma.cinema.findUnique({ where: { slug: params.slug } });

  if (!cinema) {
    return {
      notFound: true,
    };
  }

  const movieIds = (
    await prisma.showtime.groupBy({
      by: 'movieId',
      orderBy: { _count: { movieId: 'desc' } },
      take: 3,
      where: { cinemaSlug: cinema.slug },
    })
  ).map(({ movieId }) => movieId);

  const [areas, cinemas, hmm] = await Promise.all([
    prisma.area.findMany(),
    prisma.cinema.findMany(),
    prisma.movie.findMany({ where: { id: { in: movieIds } } }),
  ]);

  return {
    props: {
      areas,
      cinema,
      cinemas,
      movies: movieIds.flatMap(id => hmm.find(movie => movie.id === id) || []),
    },
    tags: new Set(['Cinema']),
  };
});

const Cinema: Page<typeof getServerSideProps> = ({ cinema, movies }) => {
  const title = `${cinema.name}の上映時間`;

  return (
    <PageLayout
      areas={[]}
      breadcrumbs={{ data: [{ name: title }], html: [<p key="title">{title}</p>] }}
      cinemas={[]}
      movies={movies}
      title={title}
    >
      <div className="mr-auto flex flex-col gap-y-3">
        <h2 className="text-lg font-semibold">{cinema.name}の人気な映画</h2>

        <div className="grid grid-cols-4 items-center gap-x-5">
          {movies.map(movie => (
            <MoviePosterLink key={movie.id} {...movie} priority />
          ))}
          もっとみる
        </div>
      </div>
    </PageLayout>
  );
};

export { getServerSideProps };

export default Cinema;
