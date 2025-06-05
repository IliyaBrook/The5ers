'use client';
import React from 'react';
import { Button, Card, Space, Typography, Layout } from 'antd';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/AuthStore';
import Image from 'next/image';
import styles from './Welcome.module.scss';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const WelcomeClient: React.FC = observer(() => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handleSignOut = () => {
    authStore.signOut();
  };

  return (
    <Content className={styles.welcome}>
      <div className={styles.welcome__container}>
        <Card className={styles.welcome__card}>
          <Space direction="vertical" size="large" className={styles.welcome__content}>
            <div className={styles.welcome__logoSection}>
              <Image
                src="/company_logo.jpg"
                alt="The5ers Logo"
                width={120}
                height={120}
                className={styles.welcome__logo}
              />
            </div>

            <Title level={1} className={styles.welcome__title}>
              Welcome to The5ers Stock Management
            </Title>

            {authStore.isAuthenticated ? (
              <>
                <div className={styles.welcome__userSection}>
                  <Title level={3} className={styles.userTitle}>
                    Hello, {authStore.fullName}! 👋
                  </Title>
                  <Paragraph className={styles.userDescription}>
                    Manage your stock portfolio and view detailed stock information. Track your
                    investments and make informed decisions.
                  </Paragraph>
                </div>

                <Space className={styles.welcome__buttons}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => router.push('/portfolio')}
                    className={styles.primaryButton}
                  >
                    📊 View Your Portfolio
                  </Button>
                  <Button
                    size="large"
                    onClick={() => router.push('/stocks')}
                    className={styles.secondaryButton}
                  >
                    📈 Browse Stocks
                  </Button>
                  <Button type="text" danger onClick={handleSignOut} className={styles.textButton}>
                    Sign Out
                  </Button>
                </Space>
              </>
            ) : (
              <>
                <div className={styles.welcome__guestSection}>
                  <Paragraph className={styles.guestDescription}>
                    Build and manage your stock portfolio with our comprehensive platform. Get
                    real-time quotes, track performance, and make informed investment decisions.
                  </Paragraph>

                  <Space
                    size="large"
                    className={`${styles.welcome__buttons} ${styles.welcome__buttonsContainer}`}
                  >
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSignIn}
                      className={`${styles.primaryButton} ${styles.guestButton}`}
                    >
                      🔐 Sign In
                    </Button>
                    <Button
                      size="large"
                      onClick={handleSignUp}
                      className={`${styles.secondaryButton} ${styles.guestButton}`}
                    >
                      ✨ Sign Up
                    </Button>
                  </Space>

                  <div>
                    <Title level={4} className={styles.featuresTitle}>
                      🚀 Platform Features:
                    </Title>
                    <div className={styles.welcome__featuresGrid}>
                      <div className={styles.welcome__featureItem}>
                        <Paragraph className={styles.featureText}>
                          📈 Real-time stock quotes
                        </Paragraph>
                      </div>
                      <div className={styles.welcome__featureItem}>
                        <Paragraph className={styles.featureText}>
                          💼 Portfolio management
                        </Paragraph>
                      </div>
                      <div className={styles.welcome__featureItem}>
                        <Paragraph className={styles.featureText}>
                          📊 Performance analytics
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Space>
        </Card>
      </div>
    </Content>
  );
});

WelcomeClient.displayName = 'WelcomeClient';

export default WelcomeClient;
