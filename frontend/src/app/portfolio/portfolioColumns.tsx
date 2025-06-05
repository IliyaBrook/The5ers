import type { IPortfolioStockWithQuote } from '@the5ers-stocks-app/shared-types';
import { Button } from '@/components/Button/Button';

export const createPortfolioColumns = (handleRemoveStock: (symbol: string) => void) => [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (symbol: string) => (
      <Button variant="link" href={`/stocks/${symbol}`}>
        {symbol}
      </Button>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Avg Price',
    dataIndex: 'averagePrice',
    key: 'averagePrice',
    render: (price: number) => `$${price.toFixed(2)}`,
  },
  {
    title: 'Current Price',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
    render: (price: number) => `$${price.toFixed(2)}`,
  },
  {
    title: 'Value',
    dataIndex: 'currentValue',
    key: 'currentValue',
    render: (value: number, record: IPortfolioStockWithQuote) => (
      <div>
        <div>${value.toFixed(2)}</div>
        <small style={{ color: '#666' }}>Invested: ${record.totalInvestment.toFixed(2)}</small>
      </div>
    ),
  },
  {
    title: 'Gain/Loss',
    dataIndex: 'gainLoss',
    key: 'gainLoss',
    render: (gainLoss: number, record: IPortfolioStockWithQuote) => (
      <span style={{ color: gainLoss >= 0 ? '#3f8600' : '#cf1322' }}>
        {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({record.gainLossPercent.toFixed(2)}%)
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_: any, record: IPortfolioStockWithQuote) => (
      <Button variant="text" danger onClick={() => handleRemoveStock(record.symbol)} size="small">
        Remove
      </Button>
    ),
  },
];
