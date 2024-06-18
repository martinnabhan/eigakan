import { Checkbox } from '@eigakan/components/Checkbox';
import { SidebarSection } from '@eigakan/components/SidebarSection';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/16/solid';
import { FilmIcon } from '@heroicons/react/24/outline';
import { Area, Movie, Prisma } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

interface Props {
  areas: Area[];
  cinemas: Prisma.CinemaGetPayload<{ select: { area: { select: { label: true } }; name: true; slug: true } }>[];
  className?: string;
  movies: Movie[];
}

const Sidebar: FunctionComponent<Props> = ({ areas, cinemas, className, movies }) => {
  const defaults = getDefaults();
  const router = useRouter();
  const params = getParams(router.query);

  return (
    <div
      className={clsx(
        className,
        'container flex gap-x-5 overflow-y-hidden overflow-x-scroll lg:sticky lg:top-28 lg:w-auto lg:shrink-0 lg:flex-col lg:gap-y-10 lg:px-0',
      )}
    >
      {areas.length > 0 && (
        <SidebarSection Icon={MapPinIcon} classNameIcon="ml-[-2px]" title="エリア">
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
                  movie: params.movie.includes(id.toString())
                    ? params.movie.filter(existingId => existingId !== id.toString())
                    : [...params.movie, id.toString()],
                },
              }}
              key={id}
              replace
              scroll={false}
              shallow
            >
              <Checkbox checked={params.movie.includes(id.toString())}>{title}</Checkbox>
            </Link>
          ))}
        </SidebarSection>
      )}

      {cinemas.length > 0 && (
        <SidebarSection Icon={VideoCameraIcon} title="映画館">
          {cinemas.map(({ area, name, slug }) => (
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
              <Checkbox checked={params.cinema.includes(slug)}>
                {name}（{area.label}）
              </Checkbox>
            </Link>
          ))}
        </SidebarSection>
      )}

      <SidebarSection Icon={CalendarDaysIcon} title="日付">
        <div className="mr-auto flex items-center">
          <input
            className="appearance-none bg-red-700"
            max={params.dateEnd || defaults.dateEnd}
            min={defaults.dateStart}
            onChange={({ target }) => {
              if (target.value === defaults.dateStart) {
                const query = { ...params, ...router.query };

                delete query.dateStart;

                router.replace({ pathname: router.pathname, query }, undefined, {
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
          〜
          <input
            className="appearance-none bg-red-700"
            min={params.dateStart || defaults.dateStart}
            onChange={({ target }) => {
              if (target.value === defaults.dateEnd) {
                const query = { ...params, ...router.query };

                delete query.dateEnd;

                router.replace({ pathname: router.pathname, query }, undefined, {
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
        </div>
      </SidebarSection>

      <SidebarSection Icon={ClockIcon} title="時間">
        <div className="mr-auto flex items-center">
          <input
            className="mr-auto appearance-none whitespace-nowrap bg-red-700"
            max={params.timeEnd || defaults.timeEnd}
            onChange={({ target }) => {
              if (target.value === defaults.timeStart) {
                const query = { ...params, ...router.query };

                delete query.timeStart;

                router.replace({ pathname: router.pathname, query }, undefined, {
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
          〜
          <input
            className="appearance-none whitespace-nowrap bg-red-700"
            min={params.timeStart || defaults.timeStart}
            onChange={({ target }) => {
              if (target.value === defaults.timeEnd) {
                const query = { ...params, ...router.query };

                delete query.timeEnd;

                router.replace({ pathname: router.pathname, query }, undefined, {
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
        </div>
      </SidebarSection>
    </div>
  );
};

export { Sidebar };
