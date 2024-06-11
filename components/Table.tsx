import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  columns?: ReactNode;
  rows: ReactNode[] | undefined;
}

const Table: FunctionComponent<Props> = ({ columns, rows }) => (
  <div className={clsx(columns ? 'shadow' : 'gap-y-2', 'grid w-full rounded-md text-sm')}>
    {columns && (
      <div
        className={clsx(
          (!rows || rows.length === 0) && 'rounded-b-md',
          'flex rounded-t-md bg-zinc-100 px-5 py-3 font-semibold text-zinc-900',
        )}
      >
        {columns}
      </div>
    )}

    {rows?.map((row, index) => (
      <div
        className={clsx(
          columns ? 'border-t border-t-zinc-200 py-3' : 'rounded-md pl-0 shadow',
          'flex overflow-hidden bg-white px-5 last:rounded-b-md first:[&>*]:font-semibold first:[&>*]:text-zinc-900',
        )}
        key={index}
      >
        {row}
      </div>
    ))}
  </div>
);

export { Table };
