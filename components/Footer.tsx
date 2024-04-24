import { FilmIcon, MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const Footer = () => (
  <>
    <div className="sticky bottom-0 border-t-2 border-red-200 bg-red-700">
      <div className="container flex h-20 w-full justify-around">
        <Link href="/search" className="w-1/4">
          <button className="flex size-full flex-col items-center justify-center gap-y-1 text-xs text-amber-500">
            <MagnifyingGlassIcon className="size-6" />
            検索
          </button>
        </Link>

        <Link href="/" className="w-1/4">
          <button className="flex size-full flex-col items-center justify-center gap-y-1 text-xs">
            <MapPinIcon className="size-6" />
            エリア
          </button>
        </Link>

        <Link href="/" className="w-1/4">
          <button className="flex size-full flex-col items-center justify-center gap-y-1 text-xs">
            <FilmIcon className="size-6" />
            映画
          </button>
        </Link>

        <Link href="/" className="w-1/4">
          <button className="flex size-full flex-col items-center justify-center gap-y-1 text-xs">
            <VideoCameraIcon className="size-6" />
            映画館
          </button>
        </Link>
      </div>
    </div>

    <footer>
      <div className="container py-16 text-xs text-red-200 text-center">
        <p>&copy; {new Date().getFullYear()} 映画館ドットコム</p>
      </div>
    </footer>
  </>
);

export { Footer };
