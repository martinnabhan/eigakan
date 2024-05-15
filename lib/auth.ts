import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module '@auth/core/jwt' {
  interface JWT {
    user: User;
  }
}

const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  callbacks: {
    jwt: ({ token, user }) => ({ ...token, ...(user && { user }) }),
    session: ({ session, token }) => ({ ...session, user: token.user as Session['user'] }),
  },
  providers: [CredentialsProvider({})],
  trustHost: true,
});

export { auth, GET, POST };
