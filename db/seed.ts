import { prisma } from '@eigakan/db';
import { areas } from '@eigakan/lib/areas';
import { cinemas } from '@eigakan/lib/cinemas';
import { Area } from '@prisma/client';

const args = <T extends Area>(record: T) => ({
  create: record,
  update: record,
  where: {
    slug: record.slug,
  },
});

const main = async () => {
  await Promise.all(Object.entries(areas).map(([slug, record]) => prisma.area.upsert(args({ ...record, slug }))));
  await Promise.all(Object.entries(cinemas).map(([slug, record]) => prisma.cinema.upsert(args({ ...record, slug }))));
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
