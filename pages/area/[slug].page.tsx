import { Area as PrismaArea } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
  area: PrismaArea;
}

const Area: NextPage<Props> = ({ area }) => <p>{area.label}</p>;

const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  if (typeof params?.slug !== 'string') {
    return {
      notFound: true,
    };
  }

  const area = await prisma?.area.findUnique({ where: { slug: params.slug } });

  if (!area) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      area,
    },
  };
};

export { getServerSideProps };

export default Area;
