import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  Icon: typeof ArrowDownIcon;
  children: ReactNode;
  title: string;
}

const SidebarSection: FunctionComponent<Props> = ({ Icon, children, title }) => (
  <div className="mb-8 flex flex-col gap-y-4 pt-8 first:pt-0">
    <h2 className="flex items-center gap-x-2 font-semibold">
      <Icon className="mt-0.5 size-4 text-amber-500" />
      {title}
    </h2>
    <div className="flex flex-col gap-y-2 text-gray-600">{children}</div>
  </div>
);

export { SidebarSection };
