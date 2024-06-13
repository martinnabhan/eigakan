import Head from 'next/head';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

interface Props {
  noindex?: boolean;
  title?: string;
}

const SEO: FunctionComponent<Props> = ({ noindex, title }) => {
  const router = useRouter();

  return (
    <Head>
      {!noindex && <link href={router.pathname} rel="canonical" />}
      {noindex && <meta content="noindex, nofollow" name="robots" />}
      <title>{title && `${title} | `}映画館ガイド</title>
    </Head>
  );
};

export { SEO };
