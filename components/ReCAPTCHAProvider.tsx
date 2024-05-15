import Head from 'next/head';
import { FunctionComponent, ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface Props {
  children: ReactNode;
}

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

const ReCAPTCHAProvider: FunctionComponent<Props> = ({ children }) =>
  RECAPTCHA_KEY ? (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: '.grecaptcha-badge { visibility: hidden !important; }' }} />
      </Head>

      <GoogleReCaptchaProvider language="ja" reCaptchaKey={RECAPTCHA_KEY}>
        {children}
      </GoogleReCaptchaProvider>
    </>
  ) : (
    children
  );

export { ReCAPTCHAProvider };
