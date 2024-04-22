import { Breadcrumbs } from '@eigakan/components/Breadcrumbs';
import { SEO } from '@eigakan/components/SEO';
import clsx from 'clsx';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = ComponentProps<typeof SEO> & {
  breadcrumbs: Pick<ComponentProps<typeof Breadcrumbs>, 'data'> & {
    html: ComponentProps<typeof Breadcrumbs>['children'];
  };
  children: ReactNode;
  col?: boolean;
};

const PageLayout: FunctionComponent<Props> = ({ breadcrumbs, children, col, title }) => (
  <>
    <SEO title={title} />

    <div className="container flex flex-col pt-16">
      <Breadcrumbs data={breadcrumbs.data}>{breadcrumbs.html}</Breadcrumbs>
      <h1 className="mb-12 text-4xl font-bold">{title}</h1>
      <div className={clsx(col ? 'flex-col gap-y-8' : 'gap-x-12', 'flex')}>{children}</div>
    </div>
  </>
);

export { PageLayout };
