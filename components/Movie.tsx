import { Movie as MovieType } from '@eigakan/index';
import { format } from 'date-fns';
import Image from 'next/image';
import { FunctionComponent } from 'react';

type Props = MovieType & { title: string };

const Movie: FunctionComponent<Props> = ({ poster, showtimes, title }) => {
  const days = new Set<string>();

  for (const showtime of showtimes) {
    days.add(format(showtime.start, 'MM/dd'));
  }

  return (
    <div>
      {poster && <Image alt="" height={300} src={`https://image.tmdb.org/t/p/w185${poster}`} width={185} />}

      <p className="font-medium">{title}</p>

      {[...days].map(day => (
        <div>
          <p>{day}</p>

          <div className="grid grid-cols-8 gap-3">
            {showtimes.map(({ end, start }) =>
              format(start, 'MM/dd') === day ? (
                <a className="flex" href="/" target="_blank">
                  {format(start, 'HH:mm')}〜{format(end, 'HH:mm')}
                </a>
              ) : null,
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { Movie };
