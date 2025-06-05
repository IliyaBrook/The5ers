import CompanyDetailClient from '@/app/stocks/[symbol]/CompanyDetailClient';
import type { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ symbol: string }>;
}

async function getStockDataForMetadata(symbol: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${baseUrl}/stocks/extended-profile/${symbol}`, {
      headers: {
        'Content-Type': 'application/json',
      },

      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }

    return { success: false };
  } catch (error) {
    console.error('Error fetching stock data for metadata:', error);
    return { success: false };
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  try {
    const response = await getStockDataForMetadata(symbolUpper);

    if (response.success && response.data) {
      const companyData = response.data;
      const companyName = companyData.companyName || symbolUpper;
      const description =
        companyData.description ||
        `View detailed stock information for ${companyName} (${symbolUpper}) including real-time quotes, financial data, and performance metrics.`;

      const previousImages = (await parent).openGraph?.images || [];

      return {
        title: `${companyName} (${symbolUpper})`,
        description: description.slice(0, 160),
        keywords: [
          symbolUpper,
          companyName,
          'stock quote',
          'stock price',
          'financial data',
          'company profile',
          'investment analysis',
          'market data',
        ],
        openGraph: {
          title: `${companyName} (${symbolUpper}) | Stock Details`,
          description: description.slice(0, 160),
          url: `/stocks/${symbolUpper}`,
          type: 'website',
          images: ['/stock-detail-og.png', ...previousImages],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${companyName} (${symbolUpper}) | Stock Details`,
          description: description.slice(0, 160),
        },
        robots: {
          index: true,
          follow: true,
        },
        alternates: {
          canonical: `/stocks/${symbolUpper}`,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata for stock:', error);
  }

  return {
    title: `${symbolUpper} Stock Details`,
    description: `View detailed stock information for ${symbolUpper} including real-time quotes, financial data, and performance metrics on The5ers platform.`,
    keywords: [symbolUpper, 'stock quote', 'stock price', 'financial data', 'investment analysis'],
    openGraph: {
      title: `${symbolUpper} Stock Details | The5ers`,
      description: `View detailed stock information for ${symbolUpper} with real-time market data.`,
      url: `/stocks/${symbolUpper}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${symbolUpper} Stock Details | The5ers`,
      description: `View detailed stock information for ${symbolUpper} with real-time market data.`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/stocks/${symbolUpper}`,
    },
  };
}

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;
  return <CompanyDetailClient symbol={symbol} />;
}
