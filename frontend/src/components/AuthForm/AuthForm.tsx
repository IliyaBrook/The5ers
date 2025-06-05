import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './AuthForm.module.scss';

const { Title, Text } = Typography;

export interface AuthFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  icon?: React.ReactNode;
  rules: Array<{ required?: boolean; message?: string; min?: number; pattern?: RegExp }>;
}

export interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: AuthFormField[];
  submitText: string;
  loadingText: string;
  isLoading: boolean;
  onSubmit: (values: Record<string, string>) => void;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  fields,
  submitText,
  loadingText,
  isLoading,
  onSubmit,
  error,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, string>) => {
    onSubmit(values);
  };

  const getDefaultIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MailOutlined />;
      case 'password':
        return <LockOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  return (
    <div className={styles.authForm}>
      <Card className={styles.authForm__card}>
        <Space direction="vertical" size="middle" className={styles.authForm__content}>
          <div className={styles.authForm__header}>
            <Title level={2} className={styles.title}>
              {title}
            </Title>
            <Text type="secondary">{subtitle}</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
            {fields.map(field => (
              <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  prefix={field.icon || getDefaultIcon(field.type)}
                />
              </Form.Item>
            ))}

            <Form.Item>
              <div className={styles.authForm__errorContainer}>
                {error && <Alert message={error} type="error" showIcon />}
              </div>
            </Form.Item>

            <Form.Item className={styles.authForm__submitButton}>
              <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
                {isLoading ? loadingText : submitText}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};
