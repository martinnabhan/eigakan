import { SessionProvider } from 'next-auth/react';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  session: ComponentProps<typeof SessionProvider>['session'];
}

const AuthProvider: FunctionComponent<Props> = ({ children, session }) => (
  <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false} session={session}>
    {children}
  </SessionProvider>
);

export { AuthProvider };
