'use client';

import { authStore } from '@/stores/AuthStore';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import styles from './AppHeader.module.scss';
import AppHeaderLogo from './AppHeaderLogo';

const { Text } = Typography;

function AppHeaderClient() {
  const router = useRouter();

  const isStorybook =
    typeof window !== 'undefined' && (window as any).__STORYBOOK_MOCK_AUTH_STORE__;

  const currentAuthStore = isStorybook ? (window as any).__STORYBOOK_MOCK_AUTH_STORE__ : authStore;

  const currentRouter = isStorybook ? (window as any).__STORYBOOK_MOCK_ROUTER__ : router;

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: currentAuthStore.fullName,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: () => {
        currentAuthStore.signOut();
        currentRouter.push('/sign-in');
      },
    },
  ];

  return (
    <div className={styles.header}>
      <div
        className={styles.header__logo}
        onClick={() => currentRouter.push('/')}
        style={{ cursor: 'pointer' }}
      >
        <AppHeaderLogo />
        <div className={styles.header__text}>The5ers Stock Management</div>
      </div>

      <div className={styles.header__nav}>
        {currentAuthStore.isAuthenticated ? (
          <>
            <Button
              type="link"
              onClick={() => currentRouter.push('/stocks')}
              className={styles.header__link}
            >
              Stocks
            </Button>
            <Button
              type="link"
              onClick={() => currentRouter.push('/portfolio')}
              className={styles.header__link}
            >
              Portfolio
            </Button>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <div className={styles.header__user}>
                <Avatar size={32} icon={<UserOutlined />} />
                <Text className={styles.header__username}>{currentAuthStore.fullName}</Text>
              </div>
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => currentRouter.push('/sign-in')}
              className={styles.header__link}
            >
              Sign In
            </Button>
            <Button
              type="primary"
              onClick={() => currentRouter.push('/sign-up')}
              className={styles.header__button}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default observer(AppHeaderClient);
