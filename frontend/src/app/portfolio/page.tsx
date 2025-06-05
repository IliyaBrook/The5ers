import PortfolioClient from './PortfolioClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description:
    'View and manage your personal stock portfolio. Track performance, analyze holdings, and monitor your investment gains and losses with real-time market data and comprehensive analytics.',
  keywords: [
    'stock portfolio',
    'portfolio management',
    'investment tracking',
    'portfolio analytics',
    'stock holdings',
    'investment performance',
    'portfolio overview',
    'trading dashboard',
  ],
  openGraph: {
    title: 'My Portfolio | The5ers Stock Management',
    description:
      'View and manage your personal stock portfolio with real-time performance tracking and comprehensive analytics.',
    url: '/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Portfolio | The5ers Stock Management',
    description: 'Track your stock investments with real-time performance analytics.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/portfolio',
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
