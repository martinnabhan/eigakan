import Head from 'next/head';
import { FunctionComponent } from 'react';

interface Props {
  noindex?: boolean;
  title?: string;
}

const SEO: FunctionComponent<Props> = ({ noindex, title }) => (
  <Head>
    {noindex && <meta content="noindex, nofollow" name="robots" />}
    <title>{title && `${title} | `}映画館.com</title>
  </Head>
);

export { SEO };
