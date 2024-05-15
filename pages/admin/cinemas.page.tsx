import { CRUD } from '@eigakan/components/CRUD';
import { Input } from '@eigakan/components/Input';
import { Select } from '@eigakan/components/Select';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { useQuery } from '@eigakan/hooks/useQuery';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import { useState } from 'react';

const Cinemas = () => {
  const [areaSlug, setAreaSlug] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const { data: areas } = useQuery(client.admin.queries.areas);

  const { props, validator } = useCRUD({
    input: { areaSlug, name, slug },
    isEqual: ({ data, input, isUpdating }) =>
      data.some(existing => (isUpdating ? input.name === existing.name : input.name === existing.name || input.slug === existing.slug)),
    mutations: client.admin.mutations.cinema,
    onInsertClick: () => {
      setAreaSlug(areas && areas.length > 0 ? areas[0].slug : '');
      setName('');
      setSlug('');
    },
    onSuccess: utils => utils.admin.queries.cinemas.invalidate(),
    query: client.admin.queries.cinemas,
    validator: validation.cinema,
  });

  return (
    <CRUD
      {...props}
      columns={
        <>
          <p className="w-full">名前</p>
          <p className="w-full">スラッグ</p>
          <p className="w-full">エリア</p>
          <p className="w-24 shrink-0" />
        </>
      }
      rows={({ DeleteButton, EditButton, data: cinemas }) =>
        cinemas?.map(cinema => (
          <>
            <p className="w-full">{cinema.name}</p>

            <p className="w-full">{cinema.slug}</p>

            <p className="w-full">{cinema.area.label}</p>

            <div className="flex w-24 shrink-0 gap-x-2">
              <EditButton
                onClick={() => {
                  setAreaSlug(cinema.area.slug);
                  setName(cinema.name);
                  setSlug(cinema.slug);
                }}
              />
              <DeleteButton disabled={cinema._count.showtimes > 0} label={cinema.name} />
            </div>
          </>
        ))
      }
      title="映画館"
    >
      <Input
        autoFocus={!props.isUpdating}
        label="名前"
        placeholder="グランドシネマサンシャイン池袋"
        loading={props.loading}
        validator={validator.shape.name}
        onChange={setName}
        value={name}
      />

      {!props.isUpdating && (
        <Input
          label="スラッグ"
          placeholder="gdcs"
          loading={props.loading}
          validator={validator.shape.slug}
          onChange={setSlug}
          value={slug}
        />
      )}

      <Select
        label="エリア"
        loading={props.loading}
        onChange={setAreaSlug}
        options={areas?.map(area => ({ label: area.label, value: area.slug }))}
        value={areaSlug}
      />
    </CRUD>
  );
};

export default Cinemas;
