import nextConfig from '@eigakan/next.config';
import type { Config } from '@netlify/functions';
import { lookup } from 'mime-types';
import sharp from 'sharp';

export const config: Config = {
  method: 'GET',
  path: '/next-image-handler',
};

const handler = async (request: Request) => {
  const reqUrl = new URL(request.url);
  const quality = Number(reqUrl.searchParams.get('q')) || 0;
  const url = reqUrl.searchParams.get('url');
  const width = Number(reqUrl.searchParams.get('w')) || 0;

  if (!quality || !url || !width) {
    return new Response('q、urlとwを指定してください。', { status: 400 });
  }

  if (nextConfig.images.remotePatterns.length > 0 && !url.startsWith('/')) {
    for (const { hostname, protocol } of nextConfig.images.remotePatterns) {
      if (!url.startsWith(`${protocol}://${hostname}`)) {
        return new Response('urlは許可されていません。', { status: 401 });
      }
    }
  }

  const response = await fetch(url.startsWith('/') ? `https://${request.headers.get('host')}/${url}` : url);

  if (!response.ok) {
    return new Response('画像を取得できませんでした。', { status: 500 });
  }

  if (!response.headers.get('Content-Type')?.includes('image/')) {
    return new Response('urlは画像ではありません。', { status: 400 });
  }

  let image = sharp(await response.arrayBuffer());

  const metaData = await image.metadata();

  if (!metaData.width || !metaData.format) {
    return new Response('urlは画像ではありません。', { status: 400 });
  }

  if (width < metaData.width) {
    image = image.resize(width);
  }

  let format = metaData.format;

  if (nextConfig.images.formats.includes('image/avif') && format !== 'avif' && request.headers.get('Accept')?.includes('image/avif')) {
    format = 'avif';
    image = image.toFormat(format, { quality });
  } else if (
    (!nextConfig.images.formats || nextConfig.images.formats.includes('image/webp')) &&
    format !== 'webp' &&
    request.headers.get('Accept')?.includes('image/webp')
  ) {
    format = 'webp';
    image = image.toFormat(format, { quality });
  }

  return new Response(await image.toBuffer(), {
    headers: {
      'Cache-Control': 'public, max-age=315360000, immutable',
      'Content-Type': lookup(format) as string,
      'Netlify-Cache-ID': `Image, Image:${url.slice(url.lastIndexOf('/') + 1)}`,
    },
  });
};

export default handler;
