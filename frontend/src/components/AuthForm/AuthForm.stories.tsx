import type { Meta, StoryObj } from '@storybook/react';
import { AuthForm } from './AuthForm';
import { ConfigProvider } from 'antd';

const meta: Meta<typeof AuthForm> = {
  title: 'Components/AuthForm',
  component: AuthForm,
  parameters: {
    layout: 'fullscreen',
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
type Story = StoryObj<typeof meta>;

const signUpFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'example@mail.com',
    rules: [
      { required: true, message: 'Please input your email!' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    rules: [
      { required: true, message: 'Please input your password!' },
      { min: 5, message: 'Password must be at least 5 characters' },
    ],
  },
  {
    name: 'firstname',
    label: 'First Name',
    type: 'text' as const,
    placeholder: 'John',
    rules: [{ required: true, message: 'Please input your first name!' }],
  },
  {
    name: 'lastname',
    label: 'Last Name',
    type: 'text' as const,
    placeholder: 'Doe',
    rules: [{ required: true, message: 'Please input your last name!' }],
  },
];

const signInFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'example@mail.com',
    rules: [
      { required: true, message: 'Please input your email!' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    rules: [
      { required: true, message: 'Please input your password!' },
      { min: 6, message: 'Password must be at least 6 characters' },
    ],
  },
];

export const SignUpForm: Story = {
  args: {
    title: 'Sign Up',
    subtitle: 'Create your account to get started',
    fields: signUpFields,
    submitText: 'Sign Up',
    loadingText: 'Signing up...',
    isLoading: false,
    onSubmit: (values: Record<string, string>) => console.log('Sign up:', values),
  },
};

export const SignInForm: Story = {
  args: {
    title: 'Sign In',
    subtitle: 'Enter your credentials to access your account',
    fields: signInFields,
    submitText: 'Sign In',
    loadingText: 'Signing in...',
    isLoading: false,
    onSubmit: (values: Record<string, string>) => console.log('Sign in:', values),
  },
};

export const LoadingState: Story = {
  args: {
    ...SignInForm.args,
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    ...SignInForm.args,
    error: 'Invalid credentials. Please try again.',
  },
};
