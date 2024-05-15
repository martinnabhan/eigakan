import { auth } from '@eigakan/lib/auth';
import { router } from '@eigakan/trpc/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = async (req: Request) => {
  const session = await auth();
  const user = session?.user;

  return fetchRequestHandler({
    createContext: () => ({ user: user && user.id ? { ...user, id: user.id } : undefined }),
    endpoint: '/api/trpc',
    req,
    router,
  });
};

export { handler as GET, handler as POST };
