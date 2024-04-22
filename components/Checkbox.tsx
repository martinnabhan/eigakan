import { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';

type Props = Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'checked'>> & { children: ReactNode };

const Checkbox: FunctionComponent<Props> = ({ checked, children }) => (
  <label className="line-clamp-1 flex items-center gap-x-3 text-red-200 lg:cursor-pointer">
    <input
      className="size-4 appearance-none rounded bg-white checked:bg-amber-500 checked:border-none checked:bg-[url('/check.svg')] mt-0.5"
      checked={checked}
      type="checkbox"
      readOnly
    />
    {children}
  </label>
);

export { Checkbox };
