import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FunctionComponent, SelectHTMLAttributes } from 'react';

type Props = Pick<SelectHTMLAttributes<HTMLSelectElement>, 'autoFocus' | 'className'> & {
  label?: string;
  loading: boolean;
  onChange: (value: string) => void;
  options: { label: string; value: string }[] | undefined;
  value: string;
};

const Select: FunctionComponent<Props> = ({ autoFocus, className, label, loading, onChange, options, value }) => {
  const select = (
    <div className="relative flex flex-col">
      <select
        autoFocus={autoFocus}
        className={clsx(
          className,
          'appearance-none rounded-md bg-white p-3 text-sm text-zinc-700 shadow ring-1 ring-zinc-200 focus:text-zinc-700 focus:shadow-inner focus:outline-none focus:ring focus:ring-amber-500 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:shadow-none lg:disabled:hover:cursor-not-allowed',
        )}
        disabled={loading}
        onChange={({ target }) => onChange(target.value)}
        value={value}
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronUpDownIcon className="absolute right-2 top-1/2 size-6 -translate-y-1/2 text-zinc-400" />
    </div>
  );

  if (label) {
    return (
      <label className="flex flex-col gap-y-2">
        <span className="text-sm font-bold">{label}</span>
        {select}
      </label>
    );
  }

  return select;
};

export { Select };
