import React from 'react';
import { Layout } from 'antd';
import AppHeader from '@/components/AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>{children}</Layout>
    </Layout>
  );
};

AppLayout.displayName = 'AppLayout';

export default AppLayout;
