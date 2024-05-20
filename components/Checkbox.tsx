import { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';

type Props = Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'checked'>> & { children: ReactNode };

const Checkbox: FunctionComponent<Props> = ({ checked, children }) => (
  <label className="line-clamp-1 flex items-center gap-x-3 whitespace-nowrap text-white/70 lg:cursor-pointer">
    <input
      checked={checked}
      className="mt-0.5 size-4 shrink-0 appearance-none rounded bg-white checked:border-none checked:bg-amber-500 checked:bg-[url('/check.svg')]"
      readOnly
      type="checkbox"
    />
    {children}
  </label>
);

export { Checkbox };
