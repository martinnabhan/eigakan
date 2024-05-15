import { prisma } from '@eigakan/db';
import { validation } from '@eigakan/validation';
import { subMinutes } from 'date-fns';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

declare module 'next-auth' {
  interface User {
    isAdmin: boolean;
  }

  interface Session {
    user: User;
  }
}

const {
  handlers: { POST },
} = NextAuth({
  callbacks: {
    jwt: ({ token, user }) => ({ ...token, ...(user && { user }) }),
  },
  providers: [
    CredentialsProvider({
      authorize: async credentials => {
        const { code, email } = z.object({ code: validation.code, email: validation.email }).parse(credentials);

        const verification = await prisma.emailVerification.count({
          where: {
            code,
            email,
            updatedAt: {
              gte: subMinutes(new Date(), 30),
            },
          },
        });

        if (!verification) {
          return null;
        }

        const { isAdmin } = await prisma.$transaction(async transaction => {
          await transaction.emailVerification.delete({ where: { email } });

          const user = await transaction.user.findUnique({ select: { isAdmin: true }, where: { email } });

          if (user) {
            return user;
          }

          await transaction.user.create({ data: { email } });

          return { isAdmin: false };
        });

        return { email, isAdmin };
      },
    }),
  ],
  trustHost: true,
});

export { POST };
