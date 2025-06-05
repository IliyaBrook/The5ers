import AppLayout from '@/Layouts/AppLayout';
import AntdProvider from '@/providers/AntdProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'The5ers Stock Management',
    template: '%s | The5ers Stock Management',
  },
  description:
    'Professional stock portfolio management platform. View real-time stock quotes, track market performance, and manage your investment portfolio with advanced analytics and insights.',
  keywords: [
    'stock management',
    'portfolio tracker',
    'stock market',
    'investment platform',
    'real-time quotes',
    'stock analytics',
    'trading dashboard',
    'financial data',
  ],
  authors: [{ name: 'The5ers Team' }],
  creator: 'The5ers',
  publisher: 'The5ers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'The5ers Stock Management',
    title: 'The5ers Stock Management',
    description:
      'Professional stock portfolio management platform with real-time market data and analytics.',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The5ers Stock Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The5ers Stock Management',
    description:
      'Professional stock portfolio management platform with real-time market data and analytics.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <AntdProvider>
            <AppLayout>{children}</AppLayout>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
