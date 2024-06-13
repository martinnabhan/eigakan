import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { HomeIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

interface Props {
  breadcrumbs: { href?: string; label: string }[];
}

const Breadcrumbs: FunctionComponent<Props> = ({ breadcrumbs }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map(({ href, label }, index) => ({
              '@type': 'ListItem',
              // TODO: domain
              item: href || router.asPath.split('?')[0],
              name: label,
              position: index + 1,
            })),
          })}
        </script>
      </Head>

      <div className="container flex items-center gap-x-5 overflow-x-scroll whitespace-nowrap pb-2">
        <Link href="/">
          <HomeIcon className="size-5" />
        </Link>

        {breadcrumbs.map(({ href, label }) => (
          <>
            <ChevronRightIcon className="size-4 shrink-0" />
            {href ? <Link href={href}>{label}</Link> : <p>{label}</p>}
          </>
        ))}
      </div>
    </>
  );
};

export { Breadcrumbs };
