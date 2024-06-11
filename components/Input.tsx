import { Validator } from '@eigakan/types/zod';
import clsx from 'clsx';
import { FunctionComponent, InputHTMLAttributes, useState } from 'react';

type Props = (Pick<InputHTMLAttributes<HTMLInputElement>, 'className'> & { label?: string; value: string }) &
  (
    | { disabled: true; onChange?: undefined }
    | (Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>> &
        Pick<InputHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'autoFocus' | 'inputMode' | 'pattern'> & {
          disabled?: false;
          loading: boolean;
          multiline?: boolean;
          onChange: (value: string) => void;
          onEnter?: () => void;
          validator: Validator;
        })
  );

const Input: FunctionComponent<Props> = ({ className, label, onChange, value, ...props }) => {
  const [error, setError] = useState(false);

  const onEnter = !props.disabled && props.onEnter;

  const input = (
    <input
      className={clsx(
        className,
        error ? 'text-red-700 ring-red-500' : 'text-zinc-700 shadow ring-zinc-200',
        'appearance-none rounded-md bg-white p-3 text-sm ring-1 focus:text-zinc-700 focus:shadow-inner focus:outline-none focus:ring focus:ring-amber-500 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:shadow-none lg:disabled:hover:cursor-not-allowed',
      )}
      disabled={props.disabled || props.loading}
      value={value}
      {...props}
      {...(!props.disabled &&
        onChange && {
          onBlur: () => setError(value.length === 0 ? false : !props.validator.safeParse(value).success),
          onChange: ({ target }) => {
            setError(false);
            onChange(target.value);
          },
          ...(onEnter &&
            !props.loading &&
            props.validator.safeParse(value).success && { onKeyDown: ({ key }) => key === 'Enter' && onEnter() }),
        })}
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
