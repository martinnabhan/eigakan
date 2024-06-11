import { PageLayoutAdmin } from '@eigakan/components/PageLayoutAdmin';
import { Table } from '@eigakan/components/Table';
import { useQuery } from '@eigakan/hooks/useQuery';
import { client } from '@eigakan/trpc/client';
import { format } from 'date-fns';
import Image from 'next/image';

const Showtimes = () => {
  const { data } = useQuery(client.admin.queries.showtimes);

  return (
    <PageLayoutAdmin title="上映">
      <Table
        rows={data?.map(({ cinema, movie, start }) => (
          <>
            <div className="flex w-full items-center gap-x-2">
              <Image alt="" className="object-cover" height={138} src={`https://image.tmdb.org/t/p/w154${movie.poster}`} width={92} />

              <div className="flex flex-col">
                <p>{movie.title}</p>
                <p>{cinema.name}</p>
                <p>{format(start, 'MM月dd日 HH:mm')}</p>
              </div>
            </div>
          </>
        ))}
      />
    </PageLayoutAdmin>
  );
};

export default Showtimes;
