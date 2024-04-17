const Footer = () => (
  <footer className="bg-red-600">
    <div className="container mx-auto">
      <div className=" border-t border-red-200 py-8  text-xs text-red-200">
        <p>&copy; {new Date().getFullYear()} 映画館ドットコム</p>
      </div>
    </div>
  </footer>
);

export { Footer };
