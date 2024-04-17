import 'tailwindcss/tailwind.css';
import { Footer } from '@eigakan/components/Footer';
import clsx from 'clsx';
import { AppProps } from 'next/app';
import { Noto_Sans_JP } from 'next/font/google';
import Head from 'next/head';
import { FunctionComponent } from 'react';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta content="#b91c1c" name="theme-color" />
    </Head>

    <div className={clsx(notoSansJP.className, 'flex min-h-screen flex-col text-white')}>
      <Component {...pageProps} />
      <Footer />
    </div>
  </>
);

export default App;
