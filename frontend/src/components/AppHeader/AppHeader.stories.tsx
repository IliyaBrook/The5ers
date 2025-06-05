import type { Meta, StoryObj } from '@storybook/react';
import { ConfigProvider } from 'antd';
import AppHeaderClient from './AppHeaderClient';

const AppHeaderWrapper = ({
  isAuthenticated = false,
  fullName = '',
  ...props
}: {
  isAuthenticated?: boolean;
  fullName?: string;
}) => {
  const mockAuthStore = {
    isAuthenticated,
    fullName,
    signOut: () => console.log('Sign out clicked'),
  };

  const mockRouter = {
    push: (path: string) => console.log('Navigate to:', path),
  };

  if (typeof window !== 'undefined') {
    (window as any).__STORYBOOK_MOCK_AUTH_STORE__ = mockAuthStore;
    (window as any).__STORYBOOK_MOCK_ROUTER__ = mockRouter;
  }

  return <AppHeaderClient {...props} />;
};

const meta: Meta<typeof AppHeaderWrapper> = {
  title: 'Components/AppHeader',
  component: AppHeaderWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isAuthenticated: {
      control: 'boolean',
      description: 'Whether user is authenticated',
    },
    fullName: {
      control: 'text',
      description: 'User full name',
    },
  },
  decorators: [
    Story => (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <Story />
      </ConfigProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppHeaderWrapper>;

export const NotAuthenticated: Story = {
  args: {
    isAuthenticated: false,
    fullName: '',
  },
};

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    fullName: 'John Doe',
  },
};

export const LongUserName: Story = {
  args: {
    isAuthenticated: true,
    fullName: 'Very Long User Name That Might Overflow',
  },
};

export const MobileView: Story = {
  args: {
    isAuthenticated: true,
    fullName: 'John Doe',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    isAuthenticated: true,
    fullName: 'John Doe',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
