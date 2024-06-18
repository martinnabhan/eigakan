import { ArrowDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  Icon: typeof ArrowDownIcon;
  children: ReactNode;
  classNameIcon?: string;
  title: string;
}

const SidebarSection: FunctionComponent<Props> = ({ Icon, children, classNameIcon, title }) => (
  <div className="flex shrink-0 flex-col gap-y-2 lg:w-full lg:gap-y-3">
    <h2 className="flex items-center gap-x-2 whitespace-nowrap font-semibold">
      <Icon className={clsx(classNameIcon, 'mt-0.5 size-5 text-amber-500')} />
      {title}
    </h2>
    <div className="flex max-h-14 flex-col gap-y-2 overflow-y-scroll pb-3 pr-1 text-white/70 lg:p-0">{children}</div>
  </div>
);

export { SidebarSection };
