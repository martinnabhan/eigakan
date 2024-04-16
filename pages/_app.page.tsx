import 'tailwindcss/tailwind.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FunctionComponent } from 'react';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta content="#000000" name="theme-color" />
    </Head>

    <div className="container divide-y divide-gray-300 text-gray-900">
      <Component {...pageProps} />
    </div>
  </>
);

export default App;
