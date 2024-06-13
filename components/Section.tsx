import { ArrowDownIcon } from '@heroicons/react/16/solid';
import { FunctionComponent, useState } from 'react';

interface Props {
  Icon: typeof ArrowDownIcon;
  children: JSX.Element[];
  title: string;
}

const Section: FunctionComponent<Props> = ({ Icon, children, title }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex flex-col items-start lg:p-5">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-amber-500 lg:mb-6">
        <Icon className="size-6" />
      </div>

      <h2 className="mb-1 font-semibold leading-7">{title}</h2>

      <div className="flex flex-col text-white/70">{showMore ? children : children.slice(0, 6)}</div>

      {!showMore && children.length > 6 && (
        <button
          className="-ml-1 mt-5 flex items-center gap-x-1 rounded-md p-1 text-sm font-medium text-amber-500 focus:outline-none focus:ring focus:ring-amber-500"
          onClick={() => setShowMore(true)}
        >
          もっとみる
        </button>
      )}
    </div>
  );
};

export { Section };
