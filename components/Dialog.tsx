import { Button } from '@eigakan/components/Button';
import CloseIcon from '@eigakan/images/close.svg';
import clsx from 'clsx';
import { ComponentProps, FunctionComponent, ReactNode, useEffect } from 'react';

interface Props {
  buttonProps: ComponentProps<typeof Button>;
  children: ReactNode;
  onClose?: () => void;
  tight?: boolean;
}

const Dialog: FunctionComponent<Props> = ({ buttonProps, children, onClose, tight }) => {
  useEffect(() => {
    if (!onClose) {
      return;
    }

    const close = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#000]/50 p-3">
        <div className="relative flex flex-col gap-y-3 rounded-md bg-zinc-50 text-zinc-700 shadow">
          {onClose && (
            <button className="absolute right-3 top-3 rounded focus:outline-none focus:ring focus:ring-amber-500" onClick={onClose}>
              <CloseIcon />
            </button>
          )}

          <div className={clsx(tight ? 'px-6 pb-4 pt-10' : 'px-8 py-6', 'flex flex-col gap-y-4')}>{children}</div>

          <div className={clsx(tight ? 'px-6' : 'px-8', 'flex h-16 rounded-b-md bg-zinc-100')}>
            <div className={clsx(onClose && 'grid-cols-2 gap-x-2', 'ml-auto grid h-16 items-center')}>
              {onClose && (
                <Button disabled={false} loading={false} onClick={onClose} variant="text">
                  キャンセル
                </Button>
              )}

              <Button {...buttonProps} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Dialog };
