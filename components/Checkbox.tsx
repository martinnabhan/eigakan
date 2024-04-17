import { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';

type Props = Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'checked'>> & { children: ReactNode };

const Checkbox: FunctionComponent<Props> = ({ checked, children }) => (
  <label className="flex items-center gap-x-3 lg:cursor-pointer">
    <input
      className="size-4 appearance-none rounded border border-gray-300 checked:border-none checked:bg-purple-600 checked:bg-[url('/check.svg')]"
      checked={checked}
      type="checkbox"
      readOnly
    />
    {children}
  </label>
);

export { Checkbox };
