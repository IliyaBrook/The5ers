'use client';
import dynamic from 'next/dynamic';
import { Card, Layout, Spin, Typography } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const WelcomeClient = dynamic(() => import('./WelcomeClient'), {
  ssr: false,
  loading: () => (
    <Content style={{ padding: '50px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <Card>
          <Title level={1}>Welcome to The5ers Stock Management</Title>
          <Spin size="large" />
        </Card>
      </div>
    </Content>
  ),
});

const Welcome: React.FC = () => {
  return <WelcomeClient />;
};

Welcome.displayName = 'Welcome';

export default Welcome;
