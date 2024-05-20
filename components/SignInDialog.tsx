import { Dialog } from '@eigakan/components/Dialog';
import { Input } from '@eigakan/components/Input';
import { useReCaptchaToken } from '@eigakan/hooks/useReCaptchaToken';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import { signIn } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';

interface Props {
  onClose?: () => void;
}

const SignInDialog: FunctionComponent<Props> = ({ onClose }) => {
  const { getReCaptchaToken } = useReCaptchaToken();

  const login = client.guest.mutations.login.useMutation();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      if (verificationSent) {
        await signIn('credentials', {
          code,
          email,
          redirect: false,
        });

        if (onClose) {
          onClose();
        }
      } else {
        await login.mutateAsync({ email, reCaptchaToken: await getReCaptchaToken() });
        setVerificationSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      buttonProps={{
        children: '送信する',
        className: 'w-24',
        disabled: verificationSent ? !validation.code.safeParse(code).success : !validation.email.safeParse(email).success,
        loading,
        onClick: handleClick,
      }}
      onClose={onClose}
    >
      {verificationSent ? (
        <Input
          autoComplete="one-time-code"
          autoFocus
          inputMode="numeric"
          label="認証コード"
          loading={loading}
          onChange={setCode}
          onEnter={handleClick}
          pattern="[0-9]*"
          placeholder="0000"
          validator={validation.code}
          value={code}
        />
      ) : (
        <Input
          autoComplete="email"
          autoFocus
          label="メールアドレス"
          loading={loading}
          onChange={setEmail}
          onEnter={handleClick}
          placeholder="example@eigakan.jp"
          validator={validation.email}
          value={email}
        />
      )}
    </Dialog>
  );
};

export { SignInDialog };
