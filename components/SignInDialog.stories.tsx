import { SignInDialog as Component } from '@eigakan/components/SignInDialog';
import { Story } from '@eigakan/types/story';
import { ComponentProps } from 'react';

export const SignInDialog: Story<ComponentProps<typeof Component>> = { args: { onClose: () => {} } };

const meta = {
  component: Component,
  title: '映画館/コンポーネント/SignInDialog',
};

export default meta;
