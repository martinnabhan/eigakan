import { Movie } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps, FunctionComponent } from 'react';

type Props = Movie & Pick<ComponentProps<typeof Image>, 'priority'>;

const MoviePosterLink: FunctionComponent<Props> = ({ id, poster, priority, title }) => {
  const router = useRouter();

  return (
    <Link
      className="relative overflow-hidden rounded-xl shadow lg:hover:shadow-lg lg:active:shadow-inner"
      href={{ pathname: '/movie/[id]', query: { ...router.query, id } }}
      key={id}
    >
      <Image
        alt={title}
        className="size-full rounded-xl border-2 border-white object-cover"
        height={225}
        priority={priority}
        src={`https://image.tmdb.org/t/p/w300${poster}`}
        width={150}
      />
    </Link>
  );
};

export { MoviePosterLink };
