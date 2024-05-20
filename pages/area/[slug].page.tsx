import { PageLayout } from '@eigakan/components/PageLayout';
import { prisma } from '@eigakan/db';
import { cache } from '@eigakan/lib/cache';
import { Page } from '@eigakan/types/page';

const getServerSideProps = cache(async params => {
  if (typeof params?.slug !== 'string') {
    return {
      notFound: true,
    };
  }

  const area = await prisma.area.findUnique({ where: { slug: params.slug } });

  if (!area) {
    return {
      notFound: true,
    };
  }

  const [areas, cinemas] = await Promise.all([prisma.area.findMany(), prisma.cinema.findMany()]);

  return {
    props: {
      area,
      areas,
      cinemas,
    },
    tags: new Set(['Area']),
  };
});

const Area: Page<typeof getServerSideProps> = ({ area, areas, cinemas }) => {
  const title = `${area.label}の上映時間`;

  return (
    <PageLayout
      areas={areas}
      breadcrumbs={{ data: [{ name: title }], html: [<p key="title">{title}</p>] }}
      cinemas={cinemas}
      movies={[]}
      title={title}
    >
      Hello
    </PageLayout>
  );
};

export { getServerSideProps };

export default Area;
