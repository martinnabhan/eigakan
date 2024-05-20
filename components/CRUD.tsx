import { Button } from '@eigakan/components/Button';
import { DeleteDialog } from '@eigakan/components/DeleteDialog';
import { PageLayoutAdmin } from '@eigakan/components/PageLayoutAdmin';
import { Table } from '@eigakan/components/Table';
import { UpsertDialog } from '@eigakan/components/UpsertDialog';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { ComponentProps, FunctionComponent, ReactNode, useState } from 'react';

type Props<Record extends object> = {
  children: ReactNode;
  data: Record[] | undefined;
  rows: (args: {
    DeleteButton: FunctionComponent<Pick<ComponentProps<typeof Button>, 'disabled'> & { label: string }>;
    EditButton: FunctionComponent<{ onClick: () => void }>;
    data: Record[] | undefined;
  }) => ReactNode[] | undefined;
  title: string;
} & Pick<ComponentProps<typeof Table>, 'columns'> &
  ReturnType<typeof useCRUD>['props'];

const CRUD = <Record extends object>({
  children,
  columns,
  data,
  disabled,
  isUpdating,
  loading,
  onDelete,
  onInsertClick,
  onUpdateClick,
  onUpsert,
  rows,
  title,
}: Props<Record>) => {
  const [dialog, setDialog] = useState<'delete' | 'upsert' | null>(null);
  const [label, setLabel] = useState<string | undefined>(undefined);

  const handleInsertClick = () => {
    onInsertClick();
    setDialog('upsert');
  };

  const openUpsertDialog = () => {
    onUpdateClick();
    setDialog('upsert');
  };

  return (
    <PageLayoutAdmin buttonProps={{ loading: !data, onClick: handleInsertClick }} subtitle={`全ての${title}のテーブルです。`} title={title}>
      <Table
        columns={columns}
        rows={rows({
          DeleteButton: props => (
            <Button disabled={props.disabled} loading={false} onClick={() => setLabel(props.label)} variant="underline">
              削除
            </Button>
          ),
          EditButton: ({ onClick }) => (
            <Button
              disabled={false}
              loading={false}
              onClick={() => {
                onClick();
                openUpsertDialog();
              }}
              variant="underline"
            >
              編集
            </Button>
          ),
          data,
        })}
      />

      {dialog === 'upsert' && (
        <UpsertDialog
          disabled={disabled}
          loading={loading}
          onClick={onUpsert}
          onClose={() => setDialog(null)}
          variant={isUpdating ? 'update' : 'insert'}
        >
          {children}
        </UpsertDialog>
      )}

      {label && <DeleteDialog label={label} onClose={() => setLabel(undefined)} onDelete={onDelete} />}
    </PageLayoutAdmin>
  );
};

export { CRUD };
