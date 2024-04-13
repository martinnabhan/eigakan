import moviesJSON from '@eigakan/data/movies.json';
import { addWeeks, endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { useState } from 'react';

const remove = [
  'PG12',
  '【字幕版】',
  'R15+',
];

const features = {
  '【4DX版】': '4DX',
  '【IMAXレーザーGT版】': 'IMAX',
  '【吹替版】': '吹替',
  'BESTIA enhanced': 'BESTIA',
};

const Index = () => {
  const [end, setEnd] = useState(format(endOfDay(addWeeks(new Date(), 1)), "yyyy-MM-dd'T'HH:mm"));
  const [start, setStart] = useState(format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm"));

  const movies = moviesJSON.filter(({ showtimes }) =>
    showtimes.some(showtime => parseISO(showtime.start) > new Date(start) && parseISO(showtime.end) < new Date(end)),
  );

  const areas = new Set<string>();
  const cinemas = new Set<string>();

  for (const { showtimes } of moviesJSON) {
    for (const showtime of showtimes) {
      areas.add(showtime.area);
      cinemas.add(showtime.cinema);
    }
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        <div>
          <h2>エリア</h2>
          {[...areas].map(area => (
            <p key={area}>{area}</p>
          ))}
        </div>

        <div>
          <h2>映画館</h2>
          {[...cinemas].map(cinema => (
            <p key={cinema}>{cinema}</p>
          ))}
        </div>

        <div>
          <h2>時間</h2>
          <input type="datetime-local" onChange={({ target }) => setStart(target.value)} value={start} />
          〜
          <input type="datetime-local" onChange={({ target }) => setEnd(target.value)} value={end} />
        </div>
      </div>

      <div>
        {movies.map(({ title }) => (
          <p key={title}>{title}</p>
        ))}
      </div>
    </div>
  );
};

export default Index;
