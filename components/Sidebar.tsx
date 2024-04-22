import { Checkbox } from '@eigakan/components/Checkbox';
import { SidebarSection } from '@eigakan/components/SidebarSection';
import { areas } from '@eigakan/lib/areas';
import { cinemas } from '@eigakan/lib/cinemas';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const defaults = getDefaults();
  const router = useRouter();
  const params = getParams(router.query);

  return (
    <div className="w-1/4 shrink-0 divide-y divide-red-200">
      <SidebarSection Icon={MapPinIcon} title="エリア">
        {Object.entries(areas).map(([slug, { label }]) => (
          <Link
            key={slug}
            href={{
              pathname: router.pathname,
              query: {
                ...params,
                ...router.query,
                area: params.area.includes(slug) ? params.area.filter(existingSlug => existingSlug !== slug) : [...params.area, slug],
              },
            }}
            shallow
            scroll={false}
            replace
          >
            <Checkbox checked={params.area.includes(slug)}>{label}</Checkbox>
          </Link>
        ))}
      </SidebarSection>

      <SidebarSection Icon={VideoCameraIcon} title="映画館">
        {Object.entries(cinemas).map(([slug, { label }]) => (
          <Link
            key={slug}
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
            shallow
            scroll={false}
            replace
          >
            <Checkbox checked={params.cinema.includes(slug)}>{label}</Checkbox>
          </Link>
        ))}
      </SidebarSection>

      <SidebarSection Icon={CalendarDaysIcon} title="日付">
        <input
          className="bg-red-700 text-red-200"
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
          className="bg-red-700 text-red-200"
          min={params.dateStart || defaults.dateStart}
          type="date"
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
          value={params.dateEnd || defaults.dateEnd}
        />
      </SidebarSection>

      <SidebarSection Icon={ClockIcon} title="時間">
        <input
          className="bg-red-700 text-red-200"
          max={params.timeEnd || defaults.timeEnd}
          type="time"
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
          value={params.timeStart || defaults.timeStart}
        />
        <input
          className="bg-red-700 text-red-200"
          min={params.timeStart || defaults.timeStart}
          type="time"
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
          value={params.timeEnd || defaults.timeEnd}
        />
      </SidebarSection>
    </div>
  );
};

export { Sidebar };
