import { DecoratedMutation, DecoratedQuery } from '@trpc/react-query/dist/createTRPCReact';

type ResolverDef = {
  errorShape: unknown;
  input: unknown;
  output: unknown;
  transformer: boolean;
};

type Mutation<Def extends ResolverDef> = DecoratedMutation<Def>;

type Query<Def extends ResolverDef> = DecoratedQuery<Def>;

export { Mutation, Query, ResolverDef };
