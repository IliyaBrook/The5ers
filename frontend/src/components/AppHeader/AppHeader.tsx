'use client';
import dynamic from 'next/dynamic';
import { Layout, Spin } from 'antd';
import styles from './AppHeader.module.scss';

const { Header } = Layout;

const AppHeaderClient = dynamic(() => import('./AppHeaderClient'), {
  ssr: false,
  loading: () => (
    <Header className={styles.appHeader}>
      <div className={styles.appHeader__logoText}>The5ers Stock Management</div>
      <Spin size="small" />
    </Header>
  ),
});

const AppHeader: React.FC = () => {
  return <AppHeaderClient />;
};

AppHeader.displayName = 'AppHeader';

export default AppHeader;
