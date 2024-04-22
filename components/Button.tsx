import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Button: FunctionComponent<Props> = ({ children }) => (
  <button className="flex items-center gap-x-1 rounded-md bg-amber-500 px-5 py-3 text-sm font-medium shadow lg:hover:shadow-lg lg:active:shadow-inner focus:outline-none focus:ring focus:ring-white">
    {children}
  </button>
);

export { Button };
