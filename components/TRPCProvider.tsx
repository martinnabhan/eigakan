import { client } from '@eigakan/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { FunctionComponent, ReactNode } from 'react';
import SuperJSON from 'superjson';

interface Props {
  children: ReactNode;
}

const config = {
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
};

const queryClient = new QueryClient(config);

const trpcClient = client.createClient({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: '/api/trpc',
    }),
  ],
});

const TRPCProvider: FunctionComponent<Props> = ({ children }) => (
  // Storybookの場合はクライアントを再利用しない
  <client.Provider client={trpcClient} queryClient={process.env.STORYBOOK ? new QueryClient(config) : queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </client.Provider>
);

export { TRPCProvider };
