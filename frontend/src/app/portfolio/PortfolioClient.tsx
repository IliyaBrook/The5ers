'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, App, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/AuthStore';
import Table from '@/components/Table/Table';
import { portfolioService } from '@/services/portfolioService';
import type { IPortfolioStockWithQuote } from '@the5ers-stocks-app/shared-types';
import { createPortfolioColumns } from './portfolioColumns';

const { Title } = Typography;

const PortfolioClient = observer(() => {
  const [portfolioData, setPortfolioData] = useState<IPortfolioStockWithQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authStore.isAuthenticated && !authStore.isInitializing) {
      fetchPortfolio();
    } else if (!authStore.isInitializing && !authStore.isAuthenticated) {
      setLoading(false);
    }
  }, [authStore.isAuthenticated, authStore.isInitializing]);

  const fetchPortfolio = async () => {
    const result = await portfolioService.getPortfolioWithQuotes();

    if (result.success && result.data) {
      setPortfolioData(result.data);
    } else {
      message.error(result.message || 'Failed to fetch portfolio data');
    }

    setLoading(false);
  };

  const handleRemoveStock = async (symbol: string) => {
    const result = await portfolioService.removeStock(symbol);

    if (result.success) {
      message.success(result.message || `${symbol} removed from your portfolio!`);
      fetchPortfolio();
    } else {
      message.error(result.message || 'Failed to remove stock from portfolio');
    }
  };

  const calculateTotals = () => {
    return portfolioData.reduce(
      (totals, stock) => ({
        totalValue: totals.totalValue + stock.currentValue,
        totalInvestment: totals.totalInvestment + stock.totalInvestment,
        totalGainLoss: totals.totalGainLoss + stock.gainLoss,
      }),
      { totalValue: 0, totalInvestment: 0, totalGainLoss: 0 }
    );
  };

  const totals = calculateTotals();
  const totalGainLossPercent =
    totals.totalInvestment > 0 ? (totals.totalGainLoss / totals.totalInvestment) * 100 : 0;

  const columns = createPortfolioColumns(handleRemoveStock);

  if (!mounted || authStore.isInitializing) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Please log in to view your portfolio</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>My Portfolio</Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={24}>
              <Col span={8}>
                <Statistic
                  title="Portfolio Value"
                  value={totals.totalValue}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Total Invested"
                  value={totals.totalInvestment}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Total Gain/Loss"
                  value={Math.abs(totals.totalGainLoss)}
                  precision={2}
                  prefix={totals.totalGainLoss >= 0 ? '+$' : '-$'}
                  suffix={
                    <>
                      ({Math.abs(totalGainLossPercent).toFixed(2)}%)
                      {totals.totalGainLoss >= 0 ? (
                        <ArrowUpOutlined style={{ marginLeft: 8 }} />
                      ) : (
                        <ArrowDownOutlined style={{ marginLeft: 8 }} />
                      )}
                    </>
                  }
                  valueStyle={{
                    color: totals.totalGainLoss >= 0 ? '#3f8600' : '#cf1322',
                    fontSize: '24px',
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card>
            <Table
              columns={columns}
              data={portfolioData}
              rowKey="id"
              pagination={false}
              emptyText="No stocks in your portfolio yet. Start by browsing stocks!"
            />
          </Card>
        </>
      )}
    </div>
  );
});

PortfolioClient.displayName = 'PortfolioClient';

export default PortfolioClient;
