import { StoryObj } from '@storybook/react';
import { Session } from 'next-auth';

type KeysRequiredButUndefinedPossible<T> = { [K in keyof Required<T>]: T[K] };

type Story<T> = Omit<StoryObj<T>, 'args' | 'parameters'> & {
  args: KeysRequiredButUndefinedPossible<StoryObj<T>['args']>;
  parameters?: StoryObj<T>['parameters'] & {
    nextjs?: { router?: { pathname?: string } };
    session?: boolean | { user: Partial<Session['user']> };
  };
};

export { Story };
