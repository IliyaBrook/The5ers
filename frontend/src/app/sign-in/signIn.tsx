'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { AuthForm, type AuthFormField } from '@/components/AuthForm';
import { useAuth, type SignInData } from '@/hooks/useAuth';

const signInFields: AuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
    rules: [
      { required: true, message: 'Please input your email!' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    rules: [
      { required: true, message: 'Please input your password!' },
      { min: 6, message: 'Password must be at least 6 characters' },
    ],
  },
];

const SignIn: React.FC = observer(() => {
  const router = useRouter();
  const { signIn, isLoading, error, setError } = useAuth();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const signInData: SignInData = {
        email: values.email,
        password: values.password,
      };
      const response = await signIn(signInData);
      if (response) {
        router.push('/');
      }
    } catch {
      setError(null);
    }
  };

  return (
    <AuthForm
      title="Sign In"
      subtitle="Enter your credentials to access your account"
      fields={signInFields}
      submitText="Sign In"
      loadingText="Signing in..."
      isLoading={isLoading}
      onSubmit={handleSubmit}
      error={error?.message}
    />
  );
});

SignIn.displayName = 'SignIn';

export default SignIn;
