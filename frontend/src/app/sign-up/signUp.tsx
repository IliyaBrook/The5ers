'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { AuthForm, type AuthFormField } from '@/components/AuthForm';
import { useAuth, type SignUpData } from '@/hooks/useAuth';

const signUpFields: AuthFormField[] = [
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
      { min: 5, message: 'Password must be at least 5 characters' },
    ],
  },
  {
    name: 'firstname',
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
    rules: [{ required: true, message: 'Please input your first name!' }],
  },
  {
    name: 'lastname',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
    rules: [{ required: true, message: 'Please input your last name!' }],
  },
];
const SignUp: React.FC = observer(() => {
  const router = useRouter();
  const { signUp, isLoading, error, setError } = useAuth();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const signUpData: SignUpData = {
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
      };
      const response = await signUp(signUpData);
      if (response) {
        router.push('/');
      }
    } catch {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      subtitle="Create your account to get started"
      fields={signUpFields}
      submitText="Sign Up"
      loadingText="Signing up..."
      isLoading={isLoading}
      onSubmit={handleSubmit}
      error={error?.message}
    />
  );
});

SignUp.displayName = 'SignUp';

export default SignUp;
