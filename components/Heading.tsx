import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';

type Props = Pick<HTMLAttributes<HTMLDivElement>, 'id'> & {
  heading: string;
  text: ReactNode;
  title: string;
};

const Heading: FunctionComponent<Props> = ({ heading, id, text, title }) => (
  <div className="mb-16 flex max-w-screen-xl scroll-m-12 flex-col items-center text-center lg:mb-24 lg:px-10" id={id}>
    <p className="mb-2 font-medium text-amber-500">{heading}</p>
    <p className="mb-6 text-3xl font-bold lg:text-4xl">{title}</p>
    <p className="font-light leading-loose text-red-200 lg:text-lg">{text}</p>
  </div>
);

export { Heading };
