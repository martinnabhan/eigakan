import { addWeeks, endOfDay, format, startOfDay } from 'date-fns';

const getDefaults = () => {
  const date = new Date();

  return {
    dateEnd: format(endOfDay(addWeeks(date, 1)), 'yyyy-MM-dd'),
    dateStart: format(startOfDay(date), 'yyyy-MM-dd'),
    timeEnd: '23:59',
    timeStart: '00:00',
  };
};

export { getDefaults };
