import { Validator } from '@eigakan/types/zod';
import clsx from 'clsx';
import { FunctionComponent, InputHTMLAttributes, useState } from 'react';

type Props = Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>> &
  Pick<InputHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'autoFocus' | 'className' | 'inputMode' | 'pattern'> & {
    label?: string;
    loading: boolean;
    multiline?: boolean;
    onChange: (value: string) => void;
    onEnter?: () => void;
    validator: Validator;
    value: string;
  };

const Input: FunctionComponent<Props> = ({
  autoComplete,
  autoFocus,
  className,
  inputMode,
  label,
  loading,
  onChange,
  onEnter,
  pattern,
  placeholder,
  validator,
  value,
}) => {
  const [error, setError] = useState(false);

  const input = (
    <input
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={clsx(
        className,
        error ? 'text-red-700 ring-red-500' : 'text-zinc-700 shadow ring-zinc-200',
        'appearance-none rounded-md bg-white p-3 text-sm ring-1 focus:text-zinc-700 focus:shadow-inner focus:outline-none focus:ring focus:ring-amber-500 lg:disabled:hover:cursor-not-allowed',
      )}
      disabled={loading}
      inputMode={inputMode}
      onBlur={() => setError(value.length === 0 ? false : !validator.safeParse(value).success)}
      onChange={({ target }) => {
        setError(false);
        onChange(target.value);
      }}
      pattern={pattern}
      placeholder={placeholder}
      value={value}
      {...(onEnter && !loading && validator.safeParse(value).success && { onKeyDown: ({ key }) => key === 'Enter' && onEnter() })}
    />
  );

  if (label) {
    return (
      <label className="flex flex-col gap-y-2">
        <span className="text-sm font-bold">{label}</span>
        {input}
      </label>
    );
  }

  return input;
};

export { Input };
