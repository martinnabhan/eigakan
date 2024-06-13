import { Button } from '@eigakan/components/Button';
import { Heading } from '@eigakan/components/Heading';
import { MoviePosterLink } from '@eigakan/components/MoviePosterLink';
import { Section } from '@eigakan/components/Section';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { defaultArgs } from '@eigakan/lib/defaultArgs';
import { Page } from '@eigakan/types/page';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { FilmIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';

const getServerSideProps = cache(async () => {
  const [areas, cinemas, movies] = await Promise.all([
    prisma.area.findMany({
      ...defaultArgs,
      select: {
        label: true,
        slug: true,
      },
    }),
    prisma.cinema.findMany({
      ...defaultArgs,
      select: {
        area: {
          select: {
            label: true,
          },
        },
        name: true,
        slug: true,
      },
    }),
    prisma.movie.findMany({
      ...defaultArgs,
      select: {
        id: true,
        poster: true,
        title: true,
      },
    }),
  ]);

  return {
    props: {
      areas,
      cinemas,
      movies,
    },
    tags: new Set(['Area', 'Cinema', 'Movie']),
  };
});

const Index: Page<typeof getServerSideProps> = ({ areas, cinemas, movies }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="pb-16 pt-10 lg:pt-0">
      <div className="container flex flex-col">
        <div className="mb-32 grid gap-y-14 lg:mb-36 lg:min-h-[calc(100vh-80px)] lg:grid-cols-2 lg:gap-x-10">
          <div className="flex flex-col items-start justify-center">
            <p className="mb-24 lg:mb-2">映画館ガイド</p>

            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
              人気映画の上映を
              <br />
              簡単に探す
            </h1>

            <p className="mb-10 font-light leading-loose text-white/70 lg:text-lg">
              映画館ガイドは人気映画の上映をエリア、映画館、
              <br className="hidden lg:block" />
              日付と時間で簡単に検索できるサイトです。
            </p>

            <div className="flex items-center gap-x-4">
              <Link href="/showtimes">
                <Button className="w-36" disabled={false} loading={loading} onClick={() => setLoading(true)}>
                  上映を探す
                  <MagnifyingGlassIcon className="size-6" />
                </Button>
              </Link>

              <a
                href="#search"
                onClick={event => {
                  event.preventDefault();
                  document.querySelector('#search')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <button className="flex items-center gap-x-1 rounded-md p-1 text-sm font-medium focus:outline-none focus:ring focus:ring-amber-500">
                  もっとみる
                  <ArrowRightIcon className="size-4" />
                </button>
              </a>
            </div>
          </div>

          <div className="flex grow items-center justify-center">
            <div className="grid grid-cols-3 gap-4 lg:gap-5">
              {movies.slice(0, 6).map(movie => (
                <MoviePosterLink key={movie.id} {...movie} priority />
              ))}
            </div>
          </div>
        </div>

        <Heading
          heading="簡単に検索"
          id="search"
          text={
            <>
              映画館ガイドは他のサイトより簡単に好きな条件で上映を探せます。
              <br />
              あなたは何で探しますか？
            </>
          }
          title="上映、エリア、映画、映画館で簡単に検索"
        />

        <div className="grid w-full gap-x-5 gap-y-16 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-white">
          <Section Icon={MagnifyingGlassIcon} title="上映時間から探す">
            <Link className="line-clamp-1" href={{ pathname: '/showtimes/[params]', query: { params: [] } }}>
              今日
            </Link>

            <Link className="line-clamp-1" href={{ pathname: '/showtimes/[params]', query: { params: [] } }}>
              明日
            </Link>

            <Link className="line-clamp-1" href={{ pathname: '/showtimes/[params]', query: { params: [] } }}>
              今週
            </Link>
          </Section>

          <Section Icon={MapPinIcon} title="人気エリアから探す">
            {areas.map(({ label, slug }) => (
              <Link className="line-clamp-1" href={{ pathname: '/showtimes', query: { area: slug } }} key={slug}>
                {label}
              </Link>
            ))}
          </Section>

          <Section Icon={FilmIcon} title="上映中の人気映画から探す">
            {movies.map(({ id, title }) => (
              <Link className="line-clamp-1" href={{ pathname: '/movie/[id]', query: { id } }} key={id}>
                {title}
              </Link>
            ))}
          </Section>

          <Section Icon={VideoCameraIcon} title="人気映画館から探す">
            {cinemas.map(({ area, name, slug }) => (
              <Link className="line-clamp-1" href={{ pathname: '/showtimes', query: { cinema: slug } }} key={slug}>
                {name}（{area.label}）
              </Link>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

export { getServerSideProps };

export default Index;
