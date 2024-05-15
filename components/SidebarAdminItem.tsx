import { ArrowDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = Required<Pick<ComponentProps<typeof Link>, 'href' | 'onMouseEnter'>> & {
  Icon: typeof ArrowDownIcon;
  children: ReactNode;
};

const SidebarAdminItem: FunctionComponent<Props> = ({ Icon, children, href, onMouseEnter }) => {
  const router = useRouter();

  return (
    <Link
      className={clsx(
        router.pathname === href && 'bg-red-900 shadow-inner',
        'flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-normal lg:hover:bg-red-900 lg:hover:shadow-inner',
      )}
      href={href}
      onMouseEnter={onMouseEnter}
    >
      <Icon className="size-6" />
      {children}
    </Link>
  );
};

export { SidebarAdminItem };
