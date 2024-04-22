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

  return {
    props: {
      area,
    },
    tags: new Set([]),
  };
});

const Area: Page<typeof getServerSideProps> = ({ area }) => {
  const title = `${area.label}の上映時間`;

  return (
    <PageLayout breadcrumbs={{ data: [{ name: title }], html: [<p>{title}</p>] }} title={title}>
      Hello
    </PageLayout>
  );
};

export { getServerSideProps };

export default Area;
