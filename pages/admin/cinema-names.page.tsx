import { CRUD } from '@eigakan/components/CRUD';
import { Input } from '@eigakan/components/Input';
import { Select } from '@eigakan/components/Select';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { useQuery } from '@eigakan/hooks/useQuery';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import { useState } from 'react';

const CinemaNames = () => {
  const [cinemaSlug, setCinemaSlug] = useState('');
  const [name, setName] = useState('');

  const { data: cinemas } = useQuery(client.admin.queries.cinemas);

  const { props, validator } = useCRUD({
    input: { cinemaSlug, name },
    isEqual: ({ data, input }) => data.some(existing => input.cinemaSlug === existing.cinema?.slug && input.name === existing.name),
    mutations: client.admin.mutations.cinemaName,
    onInsertClick: () => {
      setCinemaSlug(cinemas && cinemas.length > 0 ? cinemas[0].slug : '');
      setName('');
    },
    onSuccess: utils => utils.admin.queries.cinemaNames.invalidate(),
    query: client.admin.queries.cinemaNames,
    validator: validation.cinemaName,
  });

  return (
    <CRUD
      {...props}
      columns={
        <>
          <p className="w-full">名前</p>
          <p className="w-full">映画館</p>
          <p className="w-24 shrink-0" />
        </>
      }
      rows={({ DeleteButton, EditButton, data: cinemaNames }) =>
        cinemaNames?.map(cinemaName => (
          <>
            <p className="w-full">{cinemaName.name}</p>

            <p className="w-full">{cinemaName.cinema ? cinemaName.cinema.name : '未登録'}</p>

            <div className="flex w-24 shrink-0 gap-x-2">
              <EditButton
                onClick={() => {
                  setCinemaSlug(cinemaName.cinema?.slug || (cinemas && cinemas.length > 0 ? cinemas[0].slug : ''));
                  setName(cinemaName.name);
                }}
              />
              <DeleteButton disabled={false} label={cinemaName.name} />
            </div>
          </>
        ))
      }
      title="映画館の名前"
    >
      <Input
        autoFocus={!props.isUpdating}
        label="名前"
        loading={props.loading}
        onChange={setName}
        placeholder="グランドシネマサンシャイン 池袋"
        validator={validator.shape.name}
        value={name}
      />

      <Select
        label="映画館"
        loading={props.loading}
        onChange={setCinemaSlug}
        options={cinemas?.map(cinema => ({ label: cinema.name, value: cinema.slug }))}
        value={cinemaSlug}
      />
    </CRUD>
  );
};

export default CinemaNames;
