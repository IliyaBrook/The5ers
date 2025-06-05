'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const StocksClient = dynamic(() => import('./StocksClient'), { ssr: false });

const StocksServer = () => {
  return <StocksClient />;
};

export default StocksServer;
