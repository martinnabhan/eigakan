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

      <div className="mt-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="mb-5 flex flex-col gap-y-5 lg:mb-12 lg:gap-y-8">
          <div className="sticky top-0 z-10 border-b-2 border-white bg-red-700 shadow-[0_1px_3px_-3px_rgb(0_0_0/0.1),0_1px_2px_-2px_rgb(0_0_0/0.1)]">
            <div className="flex flex-col justify-end pt-3 lg:h-20 lg:pb-3 lg:pt-0">
              <h1 className="container shrink-0 overflow-x-scroll whitespace-nowrap pb-3 text-2xl font-bold lg:text-4xl">{title}</h1>
              <Sidebar areas={areas} cinemas={cinemas} className="lg:hidden" movies={movies} />
            </div>
          </div>

          <div className="container flex items-start gap-x-6">
            <Sidebar areas={areas} cinemas={cinemas} className="hidden lg:flex" movies={movies} />

            <div className="flex w-full flex-col gap-y-8">
              {typeof children === 'function' ? children({ defaults, params, query: router.query }) : children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PageLayout };
