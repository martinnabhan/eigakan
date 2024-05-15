import { AppRouter } from '@eigakan/trpc/router';
import { createTRPCReact } from '@trpc/react-query';

const client = createTRPCReact<AppRouter>({});

export { client };
