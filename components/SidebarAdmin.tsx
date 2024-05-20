import { Button } from '@eigakan/components/Button';
import { SidebarAdminItem } from '@eigakan/components/SidebarAdminItem';
import { client } from '@eigakan/trpc/client';
import { FilmIcon, MapPinIcon, VideoCameraIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const SidebarAdmin = () => {
  const utils = client.useUtils();

  const [loading, setLoading] = useState(false);

  const handleSignOutClick = () => {
    setLoading(true);
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="sticky top-0 flex max-h-screen w-72 shrink-0 flex-col gap-y-5 bg-red-700 px-6 pb-4">
      <Link className="flex h-16 items-center" href="/">
        映画館.com
      </Link>

      <div className="flex flex-col gap-y-2">
        {/* TODO: prefetch */}
        <SidebarAdminItem Icon={WrenchScrewdriverIcon} href="/admin" onMouseEnter={() => null}>
          管理画面
        </SidebarAdminItem>

        <SidebarAdminItem
          Icon={VideoCameraIcon}
          href="/admin/cinemas"
          onMouseEnter={() => {
            utils.admin.queries.areas.prefetch();
            utils.admin.queries.cinemas.prefetch();
          }}
        >
          映画館
        </SidebarAdminItem>

        <SidebarAdminItem
          Icon={VideoCameraIcon}
          href="/admin/cinema-names"
          onMouseEnter={() => {
            utils.admin.queries.cinemaNames.prefetch();
            utils.admin.queries.cinemas.prefetch();
          }}
        >
          映画館の名前
        </SidebarAdminItem>

        <SidebarAdminItem
          Icon={FilmIcon}
          href="/admin/movie-titles"
          onMouseEnter={() => {
            utils.admin.queries.movieTitles.prefetch();
            utils.admin.queries.movies.prefetch();
          }}
        >
          映画のタイトル
        </SidebarAdminItem>

        <SidebarAdminItem Icon={MapPinIcon} href="/admin/areas" onMouseEnter={() => utils.admin.queries.areas.prefetch()}>
          エリア
        </SidebarAdminItem>
      </div>

      <Button className="mt-auto" disabled={false} loading={loading} onClick={handleSignOutClick}>
        サインアウト
      </Button>
    </div>
  );
};

export { SidebarAdmin };
