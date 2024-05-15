import { ResolverDef } from '@eigakan/types/trpc';
import { DecoratedQuery } from '@trpc/react-query/dist/createTRPCReact';
import { useSession } from 'next-auth/react';

const useQuery = <Def extends ResolverDef>(query: DecoratedQuery<Def>, input?: ResolverDef['input']) => {
  const { status } = useSession();

  return query.useQuery(input, { enabled: status === 'authenticated' });
};

export { useQuery };
