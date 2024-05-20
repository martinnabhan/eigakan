import 'tailwindcss/tailwind.css';
import { AuthProvider } from '@eigakan/components/AuthProvider';
import { Footer } from '@eigakan/components/Footer';
import { ReCAPTCHAProvider } from '@eigakan/components/ReCAPTCHAProvider';
import { TRPCProvider } from '@eigakan/components/TRPCProvider';
import clsx from 'clsx';
import { AppProps } from 'next/app';
import { Noto_Sans_JP } from 'next/font/google';
import Head from 'next/head';
import { FunctionComponent } from 'react';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const App: FunctionComponent<AppProps> = ({ Component, pageProps: { session, ...pageProps }, router }) => (
  <>
    <Head>
      <link href="manifest.json" rel="manifest" />
      <meta content="#b91c1c" name="theme-color" />
    </Head>

    <div className={clsx(notoSansJP.className, 'flex min-h-screen flex-col')}>
      <AuthProvider session={session}>
        <ReCAPTCHAProvider>
          <TRPCProvider>
            <Component {...pageProps} />
            {!router.pathname.startsWith('/admin') && <Footer />}
          </TRPCProvider>
        </ReCAPTCHAProvider>
      </AuthProvider>
    </div>
  </>
);

export default App;
