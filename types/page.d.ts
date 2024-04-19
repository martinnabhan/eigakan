import { NextPage } from 'next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Page<GetServerSideProps extends (...args: any) => any> = NextPage<
  NonNullable<Extract<Awaited<ReturnType<GetServerSideProps>>, { notFound: undefined }>['props']>
>;

export { Page };
