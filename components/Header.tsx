import Link from 'next/link';

const Header = () => (
  <header className="sticky top-0 bg-white shadow z-10">
    <div className="container">
      <Link className="block py-4 text-lg" href="/">
        映画館
      </Link>
    </div>
  </header>
);

export { Header };
