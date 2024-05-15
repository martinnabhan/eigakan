import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { Prisma } from '@prisma/client';
import { endOfDay, parse, setHours, setMinutes, startOfDay } from 'date-fns';

type Showtime = Prisma.ShowtimeGetPayload<{ include: { cinema: { include: { area: true } } } }>;

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
  area: ({ params, showtime }) => params.area.length === 0 || params.area.includes(showtime.cinema.area.slug),
  cinema: ({ params, showtime }) => params.cinema.length === 0 || params.cinema.includes(showtime.cinema.slug),
  dateEnd: ({ defaults, params, showtime }) => showtime.end < endOfDay(parse(params.dateEnd || defaults.dateEnd, 'yyyy-MM-dd', new Date())),
  dateStart: ({ defaults, params, showtime }) =>
    showtime.start > startOfDay(parse(params.dateStart || defaults.dateStart, 'yyyy-MM-dd', new Date())),
  timeEnd: ({ defaults, params, showtime }) => {
    const [hours, minutes] = (params.timeEnd || defaults.timeEnd).split(':');

    return showtime.end < setHours(setMinutes(showtime.end, Number(minutes)), Number(hours));
  },
  timeStart: ({ defaults, params, showtime }) => {
    const [hours, minutes] = (params.timeStart || defaults.timeStart).split(':');

    return showtime.start > setHours(setMinutes(showtime.end, Number(minutes)), Number(hours));
  },
};

const filterShowtimes = ({
  showtimes,
  ...args
}: {
  defaults: ReturnType<typeof getDefaults>;
  params: ReturnType<typeof getParams>;
  showtimes: Showtime[];
}) => showtimes.filter(showtime => Object.values(handlers).every(handler => handler({ ...args, showtime })));

export { filterShowtimes };
