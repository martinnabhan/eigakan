import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', { emit: 'event', level: 'query' }] : ['error', 'warn'],
  });

  if (process.env.NODE_ENV === 'development') {
      global.prisma.$on(
        // @ts-expect-error なぜか型のエラーが出ます。
        'query',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('prisma-query-log').createPrismaQueryEventHandler({ colorParameter: '\u001b[32m', colorQuery: '\u001b[36m' }),
      );
    }
  }

const { prisma } = global;

export { prisma };
