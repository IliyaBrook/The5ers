import SignIn from './signIn';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your The5ers account to access your trading dashboard, portfolio management, and real-time stock market data. Secure login with advanced authentication.',
  keywords: [
    'sign in',
    'login',
    'trading account',
    'stock portfolio access',
    'user authentication',
    'dashboard login',
  ],
  openGraph: {
    title: 'Sign In | The5ers Stock Management',
    description:
      'Access your trading dashboard and portfolio management tools. Sign in to The5ers stock management platform.',
    url: '/sign-in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | The5ers Stock Management',
    description: 'Access your trading dashboard and portfolio management tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/sign-in',
  },
};

export default function SignInPage() {
  return <SignIn />;
}
