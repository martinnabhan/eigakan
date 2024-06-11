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
    DeleteButton: FunctionComponent<Pick<ComponentProps<typeof Button>, 'disabled'> & { label: string; onClick: () => void }>;
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
  const [dialog, setDialog] = useState<{ label: string; variant: 'delete' } | { variant: 'upsert' } | null>(null);

  const openUpsertDialog = () => {
    onUpdateClick();
    setDialog({ variant: 'upsert' });
  };

  return (
    <PageLayoutAdmin
      title={title}
      {...(onInsertClick && {
        buttonProps: {
          loading: !data,
          onClick: () => {
            onInsertClick();
            setDialog({ variant: 'upsert' });
          },
        },
      })}
    >
      <Table
        columns={columns}
        rows={rows({
          DeleteButton: ({ label, onClick, ...props }) => (
            <Button
              disabled={props.disabled}
              loading={false}
              onClick={() => {
                onClick();
                setDialog({ label, variant: 'delete' });
              }}
              variant="underline"
            >
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

      {dialog?.variant === 'delete' && <DeleteDialog label={dialog.label} onClose={() => setDialog(null)} onDelete={onDelete} />}

      {dialog?.variant === 'upsert' && (
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
    </PageLayoutAdmin>
  );
};

export { CRUD };
