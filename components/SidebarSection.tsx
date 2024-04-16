import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
}

const SidebarSection: FunctionComponent<Props> = ({ children, title }) => (
  <div className="mb-8 flex flex-col gap-y-4 pt-8 first:pt-0">
    <h2 className="font-medium">{title}</h2>

    <div className="flex flex-col gap-y-2 text-gray-600">{children}</div>
  </div>
);

export { SidebarSection };
