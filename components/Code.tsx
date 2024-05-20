import { Button } from '@eigakan/components/Button';
import { Input } from '@eigakan/components/Input';
import { validation } from '@eigakan/validation';
import { signIn } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';

interface Props {
  email: string;
  onSignIn?: () => void | Promise<void>;
}

const Code: FunctionComponent<Props> = ({ email, onSignIn }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      await signIn('credentials', {
        code,
        email,
        redirect: false,
      });

      if (onSignIn) {
        await onSignIn();
      }
    } catch (error) {
      // TODO: error
      setLoading(false);
      throw error;
    }
  };

  return (
    <div className="flex gap-x-3">
      <Input
        autoComplete="one-time-code"
        autoFocus
        inputMode="numeric"
        loading={loading}
        onChange={setCode}
        onEnter={handleClick}
        pattern="[0-9]*"
        placeholder="0000"
        validator={validation.code}
        value={code}
      />

      <Button className="w-24" disabled={!validation.code.safeParse(code).success} loading={loading} onClick={handleClick}>
        送信する
      </Button>
    </div>
  );
};

export { Code };
