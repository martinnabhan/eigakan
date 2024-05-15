import { SignInDialog } from '@eigakan/components/SignInDialog';
import { useSession } from 'next-auth/react';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedPage: FunctionComponent<Props> = ({ children }) => {
  const { status } = useSession();

  return (
    <>
      {status === 'unauthenticated' && <SignInDialog />}
      {children}
    </>
  );
};

export { ProtectedPage };
