import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { HomeIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  data: { item?: string; name: string }[];
}

const Breadcrumbs: FunctionComponent<Props> = ({ children, data }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: data.map(({ item, name }, index) => ({
              '@type': 'ListItem',
              // TODO: domain
              item: item || router.asPath.split('?')[0],
              name,
              position: index + 1,
            })),
          })}
        </script>
      </Head>

      <div className="flex items-center gap-x-5 overflow-x-scroll whitespace-nowrap mb-16">
        <Link href="/">
          <HomeIcon className="size-5" />
        </Link>

        {Array.isArray(children) ? (
          children.map(child => (
            <>
              <ChevronRightIcon className="size-4 shrink-0" />
              {child}
            </>
          ))
        ) : (
          <>
            <ChevronRightIcon className="size-4 shrink-0" />
            {children}
          </>
        )}
      </div>
    </>
  );
};

export { Breadcrumbs };
