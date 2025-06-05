import StocksServer from './StocksDynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Stocks',
  description:
    'Explore and filter thousands of stocks with real-time market data. Search, analyze, and add stocks to your portfolio with advanced filtering and sorting capabilities.',
  keywords: [
    'stock browser',
    'stock search',
    'stock filtering',
    'market data',
    'stock analysis',
    'real-time quotes',
    'stock screening',
    'investment research',
  ],
  openGraph: {
    title: 'Browse Stocks | The5ers Stock Management',
    description:
      'Explore thousands of stocks with real-time data. Advanced filtering and search capabilities for informed investment decisions.',
    url: '/stocks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Stocks | The5ers Stock Management',
    description: 'Explore thousands of stocks with real-time data and advanced filtering.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/stocks',
  },
};

export default function StocksPage() {
  return <StocksServer />;
}
