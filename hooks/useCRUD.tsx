import { useQuery } from '@eigakan/hooks/useQuery';
import { client } from '@eigakan/trpc/client';
import { Mutation, Query, ResolverDef } from '@eigakan/types/trpc';
import { useState } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';

type DataDef = ResolverDef & { output: object[] };

type InputDef = ResolverDef & { input: object };

const useCRUD = <
  Data extends DataDef,
  Delete extends ResolverDef,
  Upsert extends InputDef,
  Validator extends ZodObject<{ [key: string]: ZodTypeAny }>,
>({
  input,
  isEqual,
  mutations,
  onInsertClick,
  onSuccess,
  query,
  validator,
}: {
  input: NonNullable<Upsert['input']>;
  isEqual: (args: { data: Data['output']; input: NonNullable<Upsert['input']>; isUpdating: boolean }) => boolean;
  mutations: {
    delete: Mutation<Delete>;
    upsert: Mutation<Upsert>;
  };
  onInsertClick: () => void;
  onSuccess: (utils: ReturnType<typeof client.useUtils>) => unknown;
  query: Query<Data>;
  validator: Validator;
}) => {
  const utils = client.useUtils();
  const opts = { onSuccess: () => onSuccess(utils) };

  const deleteMutation = mutations.delete.useMutation(opts);
  const upsert = mutations.upsert.useMutation(opts);

  const { data, isPending } = useQuery(query);

  const [isUpdating, setIsUpdating] = useState(false);

  return {
    props: {
      data,
      disabled: !data || Boolean(validator.safeParse(input).error) || isEqual({ data, input, isUpdating }),
      isUpdating,
      loading: deleteMutation.isPending || isPending || upsert.isPending,
      onDelete: (labelToDelete: string) => deleteMutation.mutateAsync(labelToDelete),
      onInsertClick: () => {
        onInsertClick();
        setIsUpdating(false);
      },
      onUpdateClick: () => setIsUpdating(true),
      onUpsert: () => upsert.mutateAsync(input),
    },
    validator,
  };
};

export { useCRUD };
