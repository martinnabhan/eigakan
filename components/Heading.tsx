import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';

type Props = Pick<HTMLAttributes<HTMLDivElement>, 'id'> & {
  heading: string;
  text: ReactNode;
  title: string;
};

const Heading: FunctionComponent<Props> = ({ heading, id, text, title }) => (
  <div className="mb-24 flex max-w-screen-xl scroll-m-12 flex-col items-center px-10" id={id}>
    <p className="mb-2 font-medium text-amber-500">{heading}</p>
    <p className="mb-6 text-4xl font-bold">{title}</p>
    <p className="mb-10 text-center text-lg font-light leading-loose text-red-200">{text}</p>
  </div>
);

export { Heading };
