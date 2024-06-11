import { FilmIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <>
      <div className="sticky bottom-0 border-t-2 border-white bg-red-700">
        <div className="container flex w-full justify-around pb-8 pt-4 lg:pb-4">
          <Link className="w-1/4" href="/showtimes">
            <button
              className={clsx(
                router.pathname === '/showtimes' && 'text-amber-500',
                'flex size-full flex-col items-center justify-center gap-y-1 text-xs',
              )}
            >
              <MagnifyingGlassIcon className="size-6" />
              上映を探す
            </button>
          </Link>

          <Link className="w-1/4" href="/areas">
            <button
              className={clsx(
                router.pathname === '/areas' && 'text-amber-500',
                'flex size-full flex-col items-center justify-center gap-y-1 text-xs',
              )}
            >
              <MapPinIcon className="size-6" />
              エリアを探す
            </button>
          </Link>

          <Link className="w-1/4" href="/movies">
            <button
              className={clsx(
                router.pathname === '/movies' && 'text-amber-500',
                'flex size-full flex-col items-center justify-center gap-y-1 text-xs',
              )}
            >
              <FilmIcon className="size-6" />
              映画を探す
            </button>
          </Link>

          <Link className="w-1/4" href="/cinemas">
            <button
              className={clsx(
                router.pathname === '/cinemas' && 'text-amber-500',
                'flex size-full flex-col items-center justify-center gap-y-1 text-xs',
              )}
            >
              <VideoCameraIcon className="size-6" />
              映画館を探す
            </button>
          </Link>
        </div>
      </div>

      <footer>
        <div className="container py-16 text-center text-xs text-white/70">
          <p>&copy; {new Date().getFullYear()} 映画館ドットコム</p>
        </div>
      </footer>
    </>
  );
};

export { Footer };
