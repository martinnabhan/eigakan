import { SignInDialog } from '@eigakan/components/SignInDialog';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedAdminPage: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();

  if (status === 'authenticated' && !data.user.isAdmin) {
    router.push('/');
  }

  return (
    <>
      {status === 'unauthenticated' && <SignInDialog />}
      {children}
    </>
  );
};

export { ProtectedAdminPage };
