import { FunctionComponent, ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

const ClientSide: FunctionComponent<Props> = ({ children }) => {
  const [isServerSide, setIsServerSide] = useState(true);

  useEffect(() => {
    setIsServerSide(false);
  }, []);

  if (isServerSide) {
    return null;
  }

  return children;
};

export { ClientSide };
