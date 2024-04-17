import 'tailwindcss/tailwind.css';
import { Footer } from '@eigakan/components/Footer';
import { Header } from '@eigakan/components/Header';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FunctionComponent } from 'react';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta content="rgb(126 34 206)" name="theme-color" />
    </Head>

    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="grow py-4">
        <Component {...pageProps} />
      </main>

      <Footer />
    </div>
  </>
);

export default App;
