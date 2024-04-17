import { ClientSide } from '@eigakan/components/ClientSide';
import { areas } from '@eigakan/lib/areas';
import { Cinema, Movie } from '@prisma/client';
import { addDays, format } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

interface Props {
  cinemas: Cinema[];
  movies: Movie[];
}

const Index: NextPage<Props> = ({ cinemas, movies }) => (
  <div className="container flex flex-col gap-y-6">
    <div>
      <h2>エリアから探す</h2>

      {Object.entries(areas).map(([slug, { id, label }]) => (
        <Link key={id} href={{ pathname: '/search', query: { area: slug } }}>
          {label}
        </Link>
      ))}
    </div>

    <div>
      <h2>映画から探す</h2>

      {movies.map(({ id, title }) => (
        <Link key={id} href={{ pathname: '/search', query: { movie: id } }}>
          {title}
        </Link>
      ))}
    </div>

    <div>
      <h2>映画館から探す</h2>

      {cinemas.map(({ id, label, slug }) => (
        <Link key={id} href={{ pathname: '/search', query: { cinema: slug } }}>
          {label}
        </Link>
      ))}
    </div>

    <div>
      <h2>上映時間から探す</h2>

      <ClientSide>
        {(() => {
          const today = new Date();
          const todayString = format(today, 'yyyy-MM-dd');
          const tomorrow = addDays(today, 1);
          const tomorrowString = format(tomorrow, 'yyyy-MM-dd');

          return (
            <>
              <Link href={{ pathname: '/search', query: { dateEnd: todayString, dateStart: todayString } }}>今日</Link>
              <Link href={{ pathname: '/search', query: { dateEnd: tomorrowString, dateStart: tomorrowString } }}>明日</Link>
              <Link href={{ pathname: '/search', query: { dateEnd: format(addDays(today, 7), 'yyyy-MM-dd'), dateStart: todayString } }}>
                今週
              </Link>
            </>
          );
        })()}
      </ClientSide>
    </div>
  </div>
);

const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [cinemas, movies] = await Promise.all([
    prisma.cinema.findMany({
      orderBy: {
        showtimes: {
          _count: 'desc',
        },
      },
      take: 3,
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
      take: 3,
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
      cinemas,
      movies,
    },
  };
};

export { getServerSideProps };

export default Index;
