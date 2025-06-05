import SignUp from './signUp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your free The5ers account to access professional stock portfolio management tools. Join thousands of traders using our platform for real-time market data and analytics.',
  keywords: [
    'sign up',
    'create account',
    'register',
    'join trading platform',
    'stock portfolio signup',
    'free trading account',
  ],
  openGraph: {
    title: 'Sign Up | The5ers Stock Management',
    description:
      'Create your free account to access professional stock portfolio management tools and real-time market data.',
    url: '/sign-up',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up | The5ers Stock Management',
    description: 'Create your free account for professional stock portfolio management.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/sign-up',
  },
};

export default function SignUpPage() {
  return <SignUp />;
}
