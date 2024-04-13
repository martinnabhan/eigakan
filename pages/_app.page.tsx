import 'tailwindcss/tailwind.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FunctionComponent } from 'react';

const App: FunctionComponent<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => (
  <>
    <Head>
      <meta content="#000000" name="theme-color" />
    </Head>

    <Component {...pageProps} />
  </>
);

export default App;
