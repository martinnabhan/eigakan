import { Button } from '@eigakan/components/Button';
import { ProtectedAdminPage } from '@eigakan/components/ProtectedAdminPage';
import { SidebarAdmin } from '@eigakan/components/SidebarAdmin';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

interface Props {
  buttonProps?: Required<Pick<ComponentProps<typeof Button>, 'loading' | 'onClick'>>;
  children: ReactNode;
  subtitle: string;
  title: string;
}

const PageLayoutAdmin: FunctionComponent<Props> = ({ buttonProps, children, subtitle, title }) => (
  <ProtectedAdminPage>
    <div className="flex grow">
      <SidebarAdmin />

      <div className="container w-full bg-zinc-200 py-12 text-zinc-700">
        <div className="mb-8 flex items-center">
          <div>
            <h1 className="mb-3 text-lg font-semibold text-zinc-900">{title}</h1>
            <p className="text-sm">{subtitle}</p>
          </div>

          {buttonProps && (
            <Button className="ml-auto w-20" disabled={false} loading={buttonProps.loading} onClick={buttonProps.onClick}>
              追加する
            </Button>
          )}
        </div>

        {children}
      </div>
    </div>
  </ProtectedAdminPage>
);

export { PageLayoutAdmin };
