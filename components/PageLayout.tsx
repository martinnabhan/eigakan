import { Breadcrumbs } from '@eigakan/components/Breadcrumbs';
import { SEO } from '@eigakan/components/SEO';
import { Sidebar } from '@eigakan/components/Sidebar';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = ComponentProps<typeof SEO> &
  ComponentProps<typeof Sidebar> & {
    breadcrumbs: Pick<ComponentProps<typeof Breadcrumbs>, 'data'> & {
      html: ComponentProps<typeof Breadcrumbs>['children'];
    };
    children: ReactNode;
  };

const PageLayout: FunctionComponent<Props> = ({ areas, breadcrumbs, children, cinemas, title }) => (
  <>
    <SEO title={title} />

    <div className="flex flex-col pt-16">
      <Breadcrumbs data={breadcrumbs.data}>{breadcrumbs.html}</Breadcrumbs>
      <Sidebar areas={areas} cinemas={cinemas} />

      <div className="sticky top-0 z-10 border-b-2 border-white bg-red-700">
        <h1 className="container py-6 text-4xl font-bold">{title}</h1>
      </div>

      <div className="container flex flex-col gap-y-8 py-12">{children}</div>
    </div>
  </>
);

export { PageLayout };
