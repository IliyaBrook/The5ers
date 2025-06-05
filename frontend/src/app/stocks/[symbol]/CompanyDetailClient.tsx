'use client';

import { authStore } from '@/stores/AuthStore';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import type {
  IFmpExtendedCompanyProfile,
  IStockQuoteDisplay,
} from '@the5ers-stocks-app/shared-types';

import { portfolioService } from '@/services/portfolioService';
import { companyService } from '@/services/companyService';
import { formatMarketCap, formatVolume } from './companyHelpers';

import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

interface Props {
  symbol: string;
}

const CompanyDetailClient = observer(({ symbol }: Props) => {
  const [quote, setQuote] = useState<IStockQuoteDisplay | null>(null);
  const [profile, setProfile] = useState<IFmpExtendedCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const result = await companyService.getExtendedProfile(symbol);
      if (result.success && result.data) {
        console.log('Extended profile data:', result.data);
        setProfile(result.data);
        const quoteFromProfile = companyService.transformProfileToQuote(result.data);
        setQuote(quoteFromProfile);
      } else {
        message.error(result.message || 'Failed to fetch stock data');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      message.error('An error occurred while fetching stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPortfolio = async (values: { quantity: number; averagePrice: number }) => {
    const result = await portfolioService.addStock({
      symbol: symbol.toUpperCase(),
      quantity: values.quantity,
      averagePrice: values.averagePrice,
    });

    if (result.success) {
      message.success(result.message || `${symbol.toUpperCase()} added to your portfolio!`);
      setModalVisible(false);
      form.resetFields();
    } else {
      message.error(result.message || 'Failed to add stock to portfolio');
    }
  };

  const openAddModal = () => {
    if (!authStore.isAuthenticated) {
      message.error('Please log in to add stocks to your portfolio');
      return;
    }
    setModalVisible(true);
    
    const currentPrice = quote?.price || profile?.price;
    if (currentPrice) {
      form.setFieldValue('averagePrice', currentPrice);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quote && !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Stock not found</Title>
        <Paragraph>The stock symbol "{symbol.toUpperCase()}" could not be found.</Paragraph>
      </div>
    );
  }

  const companyName = profile?.companyName || quote?.name || symbol.toUpperCase();
  const isPositiveChange = (quote?.change || 0) >= 0;

  return (
    <div style={{ padding: '24px' }}>
      {profile && (
        <Card style={{ marginBottom: '24px' }}>
          <Row align="middle" gutter={16}>
            <Col>
              {profile.image && !profile.defaultImage && (
                <img
                  src={profile.image}
                  alt={`${profile.companyName} logo`}
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                />
              )}
            </Col>
            <Col flex="auto">
              <Title level={2} style={{ margin: 0 }}>
                {profile.companyName} ({symbol.toUpperCase()})
              </Title>
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue">{profile.sector}</Tag>
                <Tag color="green">{profile.industry}</Tag>
                <Tag>{profile.country}</Tag>
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddModal}
                disabled={!authStore.isAuthenticated}
                size="large"
              >
                Add to Portfolio
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row style={{ marginBottom: '16px' }}>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchStockData} loading={loading}>
              Refresh Data
            </Button>
          </Space>
        </Col>
      </Row>

      {quote && (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Current Price"
                value={quote.price}
                precision={2}
                prefix="$"
                valueStyle={{ fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Change"
                value={Math.abs(quote.change)}
                precision={2}
                prefix={isPositiveChange ? '+$' : '-$'}
                valueStyle={{
                  color: isPositiveChange ? '#3f8600' : '#cf1322',
                  fontSize: '20px',
                }}
                suffix={
                  <>
                    ({Math.abs(quote.changesPercentage).toFixed(2)}%)
                    {isPositiveChange ? (
                      <ArrowUpOutlined style={{ marginLeft: 4 }} />
                    ) : (
                      <ArrowDownOutlined style={{ marginLeft: 4 }} />
                    )}
                  </>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Market Cap"
                value={formatMarketCap(quote.marketCap)}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Volume"
                value={formatVolume(quote.volume)}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={12}>
          {profile && (
            <Card title="Extended Market Data" style={{ marginBottom: '16px' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Market Cap">
                  {formatMarketCap(profile.marketCap || profile.mktCap || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Volume">{formatVolume(profile.volume)}</Descriptions.Item>
                <Descriptions.Item label="Average Volume">
                  {formatVolume(profile.averageVolume || profile.volAvg || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Price Range">{profile.range || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Daily Change">
                  ${profile.change?.toFixed(2) || 'N/A'} (
                  {profile.changePercentage?.toFixed(2) || 'N/A'}%)
                </Descriptions.Item>
                <Descriptions.Item label="Currency">
                  <Tag>{profile.currency}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {profile && (
            <Card title="Financial Metrics">
              <Descriptions column={2} size="small">
                {profile.beta && (
                  <Descriptions.Item label="Beta">{profile.beta.toFixed(2)}</Descriptions.Item>
                )}
                {profile.lastDividend && (
                  <Descriptions.Item label="Dividend">
                    ${profile.lastDividend.toFixed(2)}
                  </Descriptions.Item>
                )}
                {profile.dcf && (
                  <Descriptions.Item label="DCF Value">${profile.dcf.toFixed(2)}</Descriptions.Item>
                )}
                {profile.dcfDiff && (
                  <Descriptions.Item label="DCF Difference">
                    {profile.dcfDiff.toFixed(2)}%
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Col>

        <Col span={12}>
          {profile && (
            <Card title="Company Information" style={{ marginBottom: '16px' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Exchange">
                  <Tag color="blue">{profile.exchange}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Full Exchange Name">
                  {profile.exchangeFullName}
                </Descriptions.Item>
                <Descriptions.Item label="Sector">
                  <Tag color="green">{profile.sector}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Industry">{profile.industry}</Descriptions.Item>
                <Descriptions.Item label="Country">{profile.country}</Descriptions.Item>
                <Descriptions.Item label="CEO">{profile.ceo}</Descriptions.Item>
                <Descriptions.Item label="Employees">
                  {profile.fullTimeEmployees?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="IPO Date">{profile.ipoDate}</Descriptions.Item>
                <Descriptions.Item label="Website">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  )}
                </Descriptions.Item>
              </Descriptions>

              {profile.description && (
                <div style={{ marginTop: '16px' }}>
                  <Title level={5}>Description</Title>
                  <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                    {profile.description}
                  </Paragraph>
                </div>
              )}
            </Card>
          )}

          {profile && (
            <Card title="Identifiers & Classifications">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="CIK">{profile.cik}</Descriptions.Item>
                <Descriptions.Item label="ISIN">{profile.isin}</Descriptions.Item>
                <Descriptions.Item label="CUSIP">{profile.cusip}</Descriptions.Item>
                <Descriptions.Item label="Company Address">
                  {profile.address && profile.city && profile.state && (
                    <div>
                      {profile.address}
                      <br />
                      {profile.city}, {profile.state} {profile.zip}
                      <br />
                      {profile.country}
                    </div>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">{profile.phone}</Descriptions.Item>
                <Descriptions.Item label="Type">
                  <Space>
                    {profile.isEtf && <Tag color="purple">ETF</Tag>}
                    {profile.isAdr && <Tag color="orange">ADR</Tag>}
                    {profile.isFund && <Tag color="cyan">Fund</Tag>}
                    {profile.isActivelyTrading && <Tag color="green">Active Trading</Tag>}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title={`Add ${symbol.toUpperCase()} to Portfolio`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddToPortfolio} layout="vertical">
          <Form.Item>
            <p>
              <strong>Current Price:</strong> $
              {(quote?.price || profile?.price)?.toFixed(2) || 'N/A'}
            </p>
            <p>
              <strong>Company:</strong> {companyName}
            </p>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item
            name="averagePrice"
            label="Average Price ($)"
            rules={[
              { required: true, message: 'Please enter average price' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
            ]}
          >
            <InputNumber
              min={0.01}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Enter purchase price"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" disabled={!authStore.isAuthenticated}>
                Add to Portfolio
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

CompanyDetailClient.displayName = 'CompanyDetailClient';

export default CompanyDetailClient;
