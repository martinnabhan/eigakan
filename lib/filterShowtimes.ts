import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Showtime as PrismaShowtime } from '@prisma/client';
import { endOfDay, parse, setHours, setMinutes, startOfDay } from 'date-fns';

type Showtime = Pick<PrismaShowtime, 'areaSlug' | 'cinemaSlug' | 'end' | 'movieId' | 'start'>;

const handlers: Record<
  keyof ReturnType<typeof getParams>,
  ({
    defaults,
    params,
    showtime,
  }: {
    defaults: ReturnType<typeof getDefaults>;
    params: ReturnType<typeof getParams>;
    showtime: Showtime;
  }) => boolean
> = {
  area: ({ params, showtime }) => Boolean(showtime.areaSlug && (params.area.length === 0 || params.area.includes(showtime.areaSlug))),
  cinema: ({ params, showtime }) =>
    Boolean(showtime.cinemaSlug && (params.cinema.length === 0 || params.cinema.includes(showtime.cinemaSlug))),
  dateEnd: ({ defaults, params, showtime }) => showtime.end < endOfDay(parse(params.dateEnd || defaults.dateEnd, 'yyyy-MM-dd', new Date())),
  dateStart: ({ defaults, params, showtime }) =>
    showtime.start > startOfDay(parse(params.dateStart || defaults.dateStart, 'yyyy-MM-dd', new Date())),
  movie: ({ params, showtime }) =>
    Boolean(showtime.movieId && (params.movie.length === 0 || params.movie.includes(showtime.movieId.toString()))),
  timeEnd: ({ defaults, params, showtime }) => {
    const [hours, minutes] = (params.timeEnd || defaults.timeEnd).split(':');

    return showtime.end < setHours(setMinutes(showtime.end, Number(minutes)), Number(hours));
  },
  timeStart: ({ defaults, params, showtime }) => {
    const [hours, minutes] = (params.timeStart || defaults.timeStart).split(':');

    return showtime.start > setHours(setMinutes(showtime.end, Number(minutes)), Number(hours));
  },
};

const filterShowtimes = <T extends Showtime>({
  showtimes,
  ...args
}: {
  defaults: ReturnType<typeof getDefaults>;
  params: ReturnType<typeof getParams>;
  showtimes: T[];
}): T[] => showtimes.filter(showtime => Object.values(handlers).every(handler => handler({ ...args, showtime })));

export { filterShowtimes };
