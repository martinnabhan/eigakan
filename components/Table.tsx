import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  columns: ReactNode;
  rows: ReactNode[] | undefined;
}

const Table: FunctionComponent<Props> = ({ columns, rows }) => (
  <div className="flex w-full flex-col rounded-md text-sm shadow">
    <div
      className={clsx(
        (!rows || rows.length === 0) && 'rounded-b-md',
        'flex rounded-t-md bg-zinc-100 px-5 py-3 font-semibold text-zinc-900',
      )}
    >
      {columns}
    </div>

    {rows?.map((row, index) => (
      <div
        key={index}
        className="flex border-t border-t-zinc-200 bg-white px-5 py-3 last:rounded-b-md first:[&>p]:font-semibold first:[&>p]:text-zinc-900"
      >
        {row}
      </div>
    ))}
  </div>
);

export { Table };
