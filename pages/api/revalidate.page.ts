import { prisma } from '@eigakan/db';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { NextApiHandler } from 'next';

const skip = ['/_app', '/_document', '/_error', '/404', '/500', '/api', '/auth'];

const handler: NextApiHandler = async (_, res) => {
  // TODO:
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }

  const buildManifestPath = `${process.cwd()}/.next/build-manifest.json`;

  if (!existsSync(buildManifestPath)) {
    throw new Error('build-manifest.jsonが見つかりませんでした。');
  }

  const buildManifestRaw = await readFile(buildManifestPath);
  const buildManifest = JSON.parse(buildManifestRaw.toString());
  const buildManifestPages = Object.keys(buildManifest.pages);

  const pages = (
    await Promise.all(
      buildManifestPages
        .filter(page => !skip.includes(page) && !skip.some(skipPage => skipPage === page))
        .sort()
        .flatMap(async page => {
          switch (page) {
            case '/':
              return page;

            case '/area/[slug]':
              return (await prisma.area.findMany()).map(({ slug }) => `/area/${slug}`);

            default:
              throw new Error(`不明なページがありました：${page}`);
          }
        }),
    )
  ).flat();

  await Promise.all(pages.map(page => res.revalidate(page)));

  return res.json({ pages });
};

export default handler;
