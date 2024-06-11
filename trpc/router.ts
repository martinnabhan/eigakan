import { prisma } from '@eigakan/db';
import { checkReCaptchaToken } from '@eigakan/lib/checkReCaptchaToken';
import { sendVerification } from '@eigakan/lib/sendVerification';
import { validation } from '@eigakan/validation';
import { purgeCache } from '@netlify/functions';
import { TRPCError, initTRPC } from '@trpc/server';
import { User } from 'next-auth';
import SuperJSON from 'superjson';
import { z } from 'zod';

const t = initTRPC.context<{ user?: User }>().create({ transformer: SuperJSON });

const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user?.isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { user: ctx.user } });
});

const guestProcedure = t.procedure.use(({ next }) => next({ ctx: { user: null } }));

// const userProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//
//   return next({ ctx: { user: ctx.user } });
// });

const router = t.router({
  admin: {
    mutations: {
      area: {
        delete: adminProcedure.input(validation.area.shape.label).mutation(async ({ input: label }) => {
          await prisma.area.delete({ where: { label } });
        }),
        upsert: adminProcedure.input(validation.area).mutation(async ({ input: { slug, ...update } }) => {
          await prisma.area.upsert({ create: { ...update, slug }, update, where: { slug } });
        }),
      },
      cinema: {
        delete: adminProcedure.input(validation.cinema.shape.name).mutation(async ({ input: slug }) => {
          await prisma.cinema.delete({ where: { slug } });
        }),
        upsert: adminProcedure.input(validation.cinema).mutation(async ({ input: { slug, ...update } }) => {
          await prisma.cinema.upsert({ create: { ...update, slug }, update, where: { slug } });
        }),
      },
      cinemaName: {
        delete: adminProcedure.input(validation.cinemaName.shape.name).mutation(async ({ input: name }) => {
          await prisma.cinemaName.delete({ where: { name } });
        }),
        upsert: adminProcedure.input(validation.cinemaName).mutation(async ({ input: { name, ...update } }) => {
          await prisma.cinemaName.upsert({ create: { ...update, name }, update, where: { name } });
        }),
      },
      movie: {
        delete: adminProcedure.input(validation.movie.shape.id).mutation(async ({ input: id }) => {
          await prisma.movie.delete({ where: { id } });
        }),
        upsert: adminProcedure.input(validation.movie).mutation(async ({ input: { id, ...update } }) => {
          await prisma.movie.upsert({ create: { ...update, id }, update, where: { id } });
        }),
      },
      movieTitle: {
        delete: adminProcedure.input(validation.movieTitle.shape.title).mutation(async ({ input: title }) => {
          await prisma.movieTitle.delete({ where: { title } });
        }),
        upsert: adminProcedure.input(validation.movieTitle).mutation(async ({ input: { title, ...update } }) => {
          await prisma.movieTitle.upsert({ create: { ...update, title }, update, where: { title } });
        }),
      },
      purgeCache: adminProcedure.input(z.object({ tags: z.array(validation.string) })).mutation(async ({ input: { tags } }) => {
        const token = process.env.PURGE_API_TOKEN;

        if (!token) {
          return;
        }

        await purgeCache({ tags, token });
      }),
    },
    queries: {
      areas: adminProcedure.query(() =>
        prisma.area.findMany({
          orderBy: {
            showtimes: {
              _count: 'desc',
            },
          },
          select: {
            _count: {
              select: {
                cinemas: true,
              },
            },
            label: true,
            slug: true,
          },
        }),
      ),
      cinemaNames: adminProcedure.query(() =>
        prisma.cinemaName.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            cinema: {
              select: {
                name: true,
                slug: true,
              },
            },
            name: true,
          },
        }),
      ),
      cinemas: adminProcedure.query(() =>
        prisma.cinema.findMany({
          orderBy: {
            showtimes: {
              _count: 'desc',
            },
          },
          select: {
            _count: {
              select: {
                showtimes: true,
              },
            },
            area: {
              select: {
                label: true,
                slug: true,
              },
            },
            name: true,
            slug: true,
          },
        }),
      ),
      movieTitles: adminProcedure.query(() =>
        prisma.movieTitle.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            movie: {
              select: {
                id: true,
                title: true,
              },
            },
            title: true,
          },
        }),
      ),
      movies: adminProcedure.query(() =>
        prisma.movie.findMany({
          select: {
            _count: {
              select: {
                titles: true,
              },
            },
            id: true,
            poster: true,
            title: true,
          },
        }),
      ),
      showtimes: adminProcedure.query(() =>
        prisma.showtime.findMany({
          orderBy: {
            start: 'asc',
          },
          select: {
            cinema: {
              select: {
                name: true,
              },
            },
            movie: {
              select: {
                poster: true,
                title: true,
              },
            },
            start: true,
          },
        }),
      ),
    },
  },
  guest: {
    mutations: {
      login: guestProcedure
        .input(z.object({ email: validation.email, reCaptchaToken: validation.reCaptchaToken }))
        .mutation(async ({ input: { email, reCaptchaToken } }) => {
          await checkReCaptchaToken(reCaptchaToken);
          await sendVerification(email);
        }),
    },
  },
});

export type AppRouter = typeof router;

export { router };
