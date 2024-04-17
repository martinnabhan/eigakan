import { FunctionComponent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ClientSide: FunctionComponent<Props> = ({ children }) => (typeof window === 'undefined' ? null : children);

export { ClientSide };
