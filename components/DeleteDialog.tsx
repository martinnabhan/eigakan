import { Dialog } from '@eigakan/components/Dialog';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ComponentProps, FunctionComponent, useState } from 'react';

type Props = Required<Pick<ComponentProps<typeof Dialog>, 'onClose'>> & {
  label: string;
  onDelete: (label: string) => Promise<unknown>;
};

const DeleteDialog: FunctionComponent<Props> = ({ label, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      await onDelete(label);
      onClose();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <Dialog
      buttonProps={{
        children: '削除する',
        disabled: false,
        loading,
        onClick: handleClick,
        variant: 'red',
      }}
      onClose={onClose}
      tight
    >
      <div className="flex items-center gap-x-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="size-6 text-red-600" />
        </div>

        <p>
          本当に「<span className="font-bold">{label}</span>」を削除しますか？
        </p>
      </div>
    </Dialog>
  );
};

export { DeleteDialog };
