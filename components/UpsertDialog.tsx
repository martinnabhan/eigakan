import { Dialog } from '@eigakan/components/Dialog';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = Required<Pick<ComponentProps<typeof Dialog>, 'onClose'>> & {
  children: ReactNode;
  disabled: boolean;
  loading: boolean;
  onClick: () => Promise<unknown>;
  variant: 'insert' | 'update';
};

const UpsertDialog: FunctionComponent<Props> = ({ children, disabled, loading, onClick, onClose, variant }) => (
  <Dialog
    buttonProps={{
      children: variant === 'insert' ? '追加する' : '保存する',
      disabled,
      loading,
      onClick: async () => {
        await onClick();
        onClose();
      },
    }}
    onClose={onClose}
  >
    {children}
  </Dialog>
);

export { UpsertDialog };
