import Link from 'next/link';

const Footer = () => (
  <footer className="bg-purple-700 text-white">
    <div className="container text-center">
      <Link className="block py-2 text-lg" href="/">
        映画館
      </Link>
    </div>
  </footer>
);

export { Footer };
