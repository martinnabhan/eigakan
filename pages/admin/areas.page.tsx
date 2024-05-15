import { CRUD } from '@eigakan/components/CRUD';
import { Input } from '@eigakan/components/Input';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import { useState } from 'react';

const Areas = () => {
  const [label, setLabel] = useState('');
  const [slug, setSlug] = useState('');

  const { props, validator } = useCRUD({
    input: { label, slug },
    isEqual: ({ data, input, isUpdating }) =>
      data.some(existing => (isUpdating ? input.label === existing.label : input.label === existing.label || input.slug === existing.slug)),
    mutations: client.admin.mutations.area,
    onInsertClick: () => {
      setLabel('');
      setSlug('');
    },
    onSuccess: utils => utils.admin.queries.areas.invalidate(),
    query: client.admin.queries.areas,
    validator: validation.area,
  });

  return (
    <CRUD
      {...props}
      columns={
        <>
          <p className="w-full">ラベル</p>
          <p className="w-full">スラッグ</p>
          <p className="w-24 shrink-0" />
        </>
      }
      rows={({ DeleteButton, EditButton, data: areas }) =>
        areas?.map(area => (
          <>
            <p className="w-full">{area.label}</p>

            <p className="w-full">{area.slug}</p>

            <div className="flex w-24 shrink-0 gap-x-2">
              <EditButton
                onClick={() => {
                  setLabel(area.label);
                  setSlug(area.slug);
                }}
              />
              <DeleteButton disabled={area._count.cinemas > 0} label={area.label} />
            </div>
          </>
        ))
      }
      title="エリア"
    >
      <Input
        autoFocus
        label="ラベル"
        placeholder="池袋"
        loading={props.loading}
        validator={validator.shape.label}
        onChange={setLabel}
        value={label}
      />

      {!props.isUpdating && (
        <Input
          label="スラッグ"
          placeholder="ikebukuro"
          loading={props.loading}
          validator={validator.shape.slug}
          onChange={setSlug}
          value={slug}
        />
      )}
    </CRUD>
  );
};

export default Areas;
