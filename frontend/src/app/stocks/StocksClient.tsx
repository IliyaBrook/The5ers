'use client';

import { Button } from '@/components/Button/Button';
import { authStore } from '@/stores/AuthStore';
import { type SearchResultWithUI, stocksStore, type StockWithUI } from '@/stores/StocksStore';
import { portfolioService } from '@/services/portfolioService';
import { createStockColumns, createSearchColumns, createStocksTabs } from './stocksColumns';
import {
  App,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import styles from './StocksClient.module.scss';

const { Title } = Typography;

const { Option } = Select;

const StocksClient = observer(() => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<SearchResultWithUI | null>(null);
  const [activeTab, setActiveTab] = React.useState('gainers');
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!authStore.isInitializing) {
      stocksStore.fetchMarketMovers().catch(() => {
        message.error('Failed to fetch market data');
      });
    }
  }, [message, authStore.isInitializing]);

  const onInputSearch = useCallback((value: string) => {
    stocksStore.searchStocks(value);
  }, []);

  const handleAddToPortfolio = async (values: { quantity: number; averagePrice: number }) => {
    if (!selectedStock) return;

    const result = await portfolioService.addStock({
      symbol: selectedStock.symbol,
      quantity: values.quantity,
      averagePrice: values.averagePrice,
    });

    if (result.success) {
      message.success(result.message || `${selectedStock.symbol} added to your portfolio!`);
      setModalVisible(false);
      form.resetFields();
      setSelectedStock(null);
    } else {
      message.error(result.message || 'Failed to add stock to portfolio');
    }
  };

  const openAddModal = (stock: SearchResultWithUI) => {
    if (!authStore.isAuthenticated) {
      message.error('Please log in to add stocks to your portfolio');
      return;
    }
    setSelectedStock(stock);
    setModalVisible(true);
  };

  const openAddModalFromStock = (stock: StockWithUI) => {
    if (!authStore.isAuthenticated) {
      message.error('Please log in to add stocks to your portfolio');
      return;
    }

    const searchResultFormat: SearchResultWithUI = {
      symbol: stock.symbol,
      name: stock.name,
      currency: 'USD',
      stockExchange: stock.exchange || 'N/A',
      exchangeShortName: stock.exchange || 'N/A',
      _id: stock._id,
    };

    setSelectedStock(searchResultFormat);
    setModalVisible(true);
  };

  const stockColumns = createStockColumns(openAddModalFromStock);
  const searchColumns = createSearchColumns(openAddModal);

  const tabItems = createStocksTabs(stockColumns, searchColumns, onInputSearch);

  const userData = authStore?.user;
  const fullName = `${userData?.firstname} ${userData?.lastname}`;

  return (
    <div className={styles.stocks}>
      <Title level={2}>Stock Market</Title>

      <Row gutter={16} className={styles.filtersRow}>
        <Col span={12}>
          <Space>
            <span>Filter by Price:</span>
            <Select
              value={stocksStore.filterBy}
              className={styles.filterSelect}
              onChange={value => stocksStore.setFilters(undefined, value)}
              disabled={activeTab === 'search'}
            >
              <Option value="all">All Prices</Option>
              <Option value="0-10">$0 - $10</Option>
              <Option value="10-20">$10 - $20</Option>
              <Option value="20-30">$20 - $30</Option>
              <Option value="30-40">$30 - $40</Option>
              <Option value="40-50">$40 - $50</Option>
              <Option value="50-60">$50 - $60</Option>
              <Option value="60-70">$60 - $70</Option>
              <Option value="above70">Above $70</Option>
            </Select>
          </Space>
        </Col>
        <Col span={12}>
          <div className={styles.authSection}>
            {authStore.isAuthenticated ? (
              <Space>
                <span>Welcome, {fullName || 'User'}!</span>
                <Button variant="secondary" onClick={() => authStore.signOut()} size="small">
                  Sign Out
                </Button>
              </Space>
            ) : (
              <Button
                variant="primary"
                onClick={() => (window.location.href = '/sign-in')}
                size="small"
              >
                Sign In
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Card className={styles.cardButtonWrapper}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
      </Card>

      <Modal
        title={`Add ${selectedStock?.symbol} to Portfolio`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedStock(null);
        }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleAddToPortfolio} layout="vertical">
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
          >
            <InputNumber
              className={styles.modalInputFullWidth}
              placeholder="Enter number of shares"
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="Average Price"
            name="averagePrice"
            rules={[
              { required: true, message: 'Please enter average price' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
            ]}
          >
            <InputNumber
              className={styles.modalInputFullWidth}
              placeholder="Enter average purchase price"
              min={0.01}
              precision={2}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>

          <Form.Item className={styles.modalFormItemActions}>
            <Space>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setSelectedStock(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add to Portfolio
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

StocksClient.displayName = 'StocksClient';

export default StocksClient;
