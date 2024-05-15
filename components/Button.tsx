import { Spinner } from '@eigakan/components/Spinner';
import clsx from 'clsx';
import { ButtonHTMLAttributes, FunctionComponent } from 'react';

type Props = Required<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onClick'> & {
    disabled: unknown;
    loading: boolean;
    variant?: 'red' | 'text' | 'underline';
  };

const Button: FunctionComponent<Props> = ({ children, className, disabled, loading, onClick, variant = 'amber' }) => (
  <button
    className={clsx(
      className,
      variant === 'amber' && 'bg-amber-500 lg:hover:bg-amber-500/90 lg:disabled:hover:bg-amber-500',
      variant === 'red' && 'bg-red-600 lg:hover:bg-red-600/90 lg:disabled:hover:bg-red-600',
      variant === 'text' && 'focus:ring-amber-500',
      variant === 'underline' && 'h-auto text-red-600 focus:ring-red-600 lg:hover:underline lg:hover:disabled:no-underline',
      (variant === 'amber' || variant === 'red') && 'text-white shadow focus:ring-white disabled:shadow-none lg:active:shadow-inner',
      'flex h-10 items-center justify-center gap-x-1 rounded-md px-2 text-sm font-medium focus:outline-none focus:ring disabled:opacity-70 lg:cursor-pointer lg:disabled:cursor-not-allowed',
    )}
    disabled={Boolean(disabled) || loading}
    onClick={onClick}
  >
    {loading ? <Spinner /> : children}
  </button>
);

export { Button };
