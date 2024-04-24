import { Breadcrumbs } from '@eigakan/components/Breadcrumbs';
import { SEO } from '@eigakan/components/SEO';
import { Sidebar } from '@eigakan/components/Sidebar';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = ComponentProps<typeof SEO> & {
  breadcrumbs: Pick<ComponentProps<typeof Breadcrumbs>, 'data'> & {
    html: ComponentProps<typeof Breadcrumbs>['children'];
  };
  children: ReactNode;
};

const PageLayout: FunctionComponent<Props> = ({ breadcrumbs, children, title }) => (
  <>
    <SEO title={title} />

    <div className="flex flex-col pt-16">
      <Breadcrumbs data={breadcrumbs.data}>{breadcrumbs.html}</Breadcrumbs>
      <Sidebar />

      <div className="sticky top-0 border-b-2 border-red-200 bg-red-700 z-10">
        <h1 className="container text-4xl font-bold py-6">{title}</h1>
      </div>

      <div className="flex flex-col gap-y-8 py-12 container">{children}</div>
    </div>
  </>
);

export { PageLayout };
