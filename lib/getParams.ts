import { ParsedUrlQuery } from 'querystring';

const getParams = (query: ParsedUrlQuery) => {
  const params: {
    area: string[];
    cinema: string[];
    dateEnd?: string;
    dateStart?: string;
    movie: string[];
    timeEnd?: string;
    timeStart?: string;
  } = {
    area: [],
    cinema: [],
    movie: [],
  };

  const setArrayValue = (
    key: Exclude<keyof typeof params, 'dateEnd' | 'dateStart' | 'dateEnd' | 'timeEnd' | 'timeStart'>,
    value: string | string[] | undefined,
  ) => {
    if (value) {
      params[key] = typeof value === 'string' ? [value] : value;
    }
  };

  const setValue = (key: Exclude<keyof typeof params, 'area' | 'cinema' | 'movie'>, value: string | string[] | undefined) => {
    if (typeof value === 'string') {
      params[key] = value;
    }
  };

  const handlers: Record<keyof typeof params, () => void> = {
    area: () => setArrayValue('area', query['area']),
    cinema: () => setArrayValue('cinema', query['cinema']),
    dateEnd: () => setValue('dateEnd', query['dateEnd']),
    dateStart: () => setValue('dateStart', query['dateStart']),
    movie: () => setArrayValue('movie', query['movie']),
    timeEnd: () => setValue('timeEnd', query['timeEnd']),
    timeStart: () => setValue('timeStart', query['timeStart']),
  };

  Object.values(handlers).forEach(handler => handler());

  return params;
};

export { getParams };
