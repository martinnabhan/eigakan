import { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';

type Props = Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onChange'>> & { children: ReactNode };

const Checkbox: FunctionComponent<Props> = ({ checked, children, onChange }) => (
  <label className="flex items-center gap-x-3 lg:cursor-pointer">
    <input
      className="size-4 appearance-none rounded border border-gray-300 checked:border-none checked:bg-purple-600 checked:bg-[url('/check.svg')]"
      checked={checked}
      onChange={onChange}
      type="checkbox"
    />
    {children}
  </label>
);

export { Checkbox };
