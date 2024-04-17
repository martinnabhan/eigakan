import Link from 'next/link';

const Header = () => (
  <header className="sticky top-0 bg-purple-700 text-white shadow">
    <div className="container">
      <Link className="block py-4 text-lg" href="/">
        映画館
      </Link>
    </div>
  </header>
);

export { Header };
