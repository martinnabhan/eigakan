import { Checkbox } from '@eigakan/components/Checkbox';
import { SidebarSection } from '@eigakan/components/SidebarSection';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/16/solid';
import { FilmIcon } from '@heroicons/react/24/outline';
import { Area, Cinema, Movie } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

interface Props {
  areas: Area[];
  cinemas: Cinema[];
  movies: Movie[];
}

const Sidebar: FunctionComponent<Props> = ({ areas, cinemas, movies }) => {
  const defaults = getDefaults();
  const router = useRouter();
  const params = getParams(router.query);

  return (
    <div className="sticky top-0 z-10 border-b-2 border-white bg-red-700 shadow">
      <div className="container flex gap-x-10 overflow-x-scroll py-4 lg:grid lg:grid-cols-4">
        {areas.length > 0 && (
          <SidebarSection Icon={MapPinIcon} title="エリア">
            {areas.map(({ label, slug }) => (
              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...params,
                    ...router.query,
                    area: params.area.includes(slug) ? params.area.filter(existingSlug => existingSlug !== slug) : [...params.area, slug],
                  },
                }}
                key={slug}
                replace
                scroll={false}
                shallow
              >
                <Checkbox checked={params.area.includes(slug)}>{label}</Checkbox>
              </Link>
            ))}
          </SidebarSection>
        )}

        {movies.length > 0 && (
          <SidebarSection Icon={FilmIcon} title="映画">
            {movies.map(({ id, title }) => (
              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...params,
                    ...router.query,
                    movie: params.movie.includes(id) ? params.movie.filter(existingId => existingId !== id) : [...params.movie, id],
                  },
                }}
                key={id}
                replace
                scroll={false}
                shallow
              >
                <Checkbox checked={params.movie.includes(id)}>{title}</Checkbox>
              </Link>
            ))}
          </SidebarSection>
        )}

        {cinemas.length > 0 && (
          <SidebarSection Icon={VideoCameraIcon} title="映画館">
            {cinemas.map(({ name, slug }) => (
              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...params,
                    ...router.query,
                    cinema: params.cinema.includes(slug)
                      ? params.cinema.filter(existingSlug => existingSlug !== slug)
                      : [...params.cinema, slug],
                  },
                }}
                key={slug}
                replace
                scroll={false}
                shallow
              >
                <Checkbox checked={params.cinema.includes(slug)}>{name}</Checkbox>
              </Link>
            ))}
          </SidebarSection>
        )}

        <SidebarSection Icon={CalendarDaysIcon} title="日付">
          <input
            className="appearance-none bg-red-700 text-white/70"
            max={params.dateEnd || defaults.dateEnd}
            min={defaults.dateStart}
            onChange={({ target }) => {
              if (target.value === defaults.dateStart) {
                delete params.dateStart;
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              } else {
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query, dateStart: target.value } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              }
            }}
            type="date"
            value={params.dateStart || defaults.dateStart}
          />
          <input
            className="appearance-none bg-red-700 text-white/70"
            min={params.dateStart || defaults.dateStart}
            onChange={({ target }) => {
              if (target.value === defaults.dateEnd) {
                delete params.dateEnd;
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              } else {
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query, dateEnd: target.value } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              }
            }}
            type="date"
            value={params.dateEnd || defaults.dateEnd}
          />
        </SidebarSection>

        <SidebarSection Icon={ClockIcon} title="時間">
          <input
            className="mr-auto appearance-none whitespace-nowrap bg-red-700 text-white/70"
            max={params.timeEnd || defaults.timeEnd}
            onChange={({ target }) => {
              if (target.value === defaults.timeStart) {
                delete params.timeStart;
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              } else {
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query, timeStart: target.value } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              }
            }}
            type="time"
            value={params.timeStart || defaults.timeStart}
          />
          <input
            className="appearance-none whitespace-nowrap bg-red-700 text-white/70"
            min={params.timeStart || defaults.timeStart}
            onChange={({ target }) => {
              if (target.value === defaults.timeEnd) {
                delete params.timeEnd;
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              } else {
                router.replace({ pathname: router.pathname, query: { ...params, ...router.query, timeEnd: target.value } }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              }
            }}
            type="time"
            value={params.timeEnd || defaults.timeEnd}
          />
        </SidebarSection>
      </div>
    </div>
  );
};

export { Sidebar };
