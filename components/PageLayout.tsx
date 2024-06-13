import { Breadcrumbs } from '@eigakan/components/Breadcrumbs';
import { SEO } from '@eigakan/components/SEO';
import { Sidebar } from '@eigakan/components/Sidebar';
import { getDefaults } from '@eigakan/lib/getDefaults';
import { getParams } from '@eigakan/lib/getParams';
import { useRouter } from 'next/router';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

type Props = ComponentProps<typeof Breadcrumbs> &
  ComponentProps<typeof SEO> &
  ComponentProps<typeof Sidebar> & {
    children:
      | ReactNode
      | ((args: {
          defaults: ReturnType<typeof getDefaults>;
          params: ReturnType<typeof getParams>;
          query: ReturnType<typeof useRouter>['query'];
        }) => ReactNode);
  };

const PageLayout: FunctionComponent<Props> = ({ areas, breadcrumbs, children, cinemas, movies, title }) => {
  const router = useRouter();

  const defaults = getDefaults();
  const params = getParams(router.query);

  return (
    <>
      <SEO title={title} />

      <div className="flex flex-col pt-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Sidebar areas={areas} cinemas={cinemas} movies={movies} />

        <h1 className="container my-6 text-xl font-bold lg:my-12 lg:text-4xl">{title}</h1>

        <div className="container mb-12 flex flex-col gap-y-8">
          {typeof children === 'function' ? children({ defaults, params, query: router.query }) : children}
        </div>
      </div>
    </>
  );
};

export { PageLayout };
