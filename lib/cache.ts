import { GetServerSidePropsContext } from 'next';

type CacheKey = 'Area' | 'Cinema' | 'Movie' | `Movie:${number}`;

const cache =
  <T>(
    getServerSideProps: (params: GetServerSidePropsContext['params']) => Promise<{ props: T; tags: Set<CacheKey> } | { notFound: true }>,
  ): ((context: GetServerSidePropsContext) => Promise<{ notFound: undefined; props: T } | { notFound: true }>) =>
  async ({ params, res }) => {
    const result = await getServerSideProps(params);

    if ('notFound' in result) {
      return result;
    }

    const { props, tags } = result;

    res.setHeader('CDN-Cache-Control', 'public, max-age=315360000, immutable');
    res.setHeader('Netlify-Cache-ID', [...tags]);

    return { notFound: undefined, props };
  };

export { cache };
