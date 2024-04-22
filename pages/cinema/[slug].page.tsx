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
      where: { cinemaId: cinema.id },
    })
  ).map(({ movieId }) => movieId);

  const hmm = await prisma.movie.findMany({ where: { id: { in: movieIds } } });

  return {
    props: {
      cinema,
      movies: movieIds.flatMap(id => hmm.find(movie => movie.id === id) || []),
    },
    tags: new Set([]),
  };
});

const Cinema: Page<typeof getServerSideProps> = ({ cinema, movies }) => {
  const title = `${cinema.label}の上映時間`;

  return (
    <PageLayout breadcrumbs={{ data: [{ name: title }], html: [<p>{title}</p>] }} col title={title}>
      <div className="mr-auto flex flex-col gap-y-3">
        <h2 className="text-lg font-semibold">{cinema.label}の人気な映画</h2>

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
