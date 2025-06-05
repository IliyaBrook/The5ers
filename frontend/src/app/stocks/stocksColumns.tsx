import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from '@/components/Button/Button';
import { authStore } from '@/stores/AuthStore';
import type { SearchResultWithUI, StockWithUI } from '@/stores/StocksStore';
import { stocksStore } from '@/stores/StocksStore';
import Table from '@/components/Table/Table';
import { SearchInput } from './SearchInput';
import styles from './StocksClient.module.scss';
import type { ColumnsType } from 'antd/es/table';

export const createStockColumns = (
  openAddModalFromStock: (stock: StockWithUI) => void
): ColumnsType<StockWithUI> => [
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
    title: 'Company Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => `$${price.toFixed(2)}`,
  },
  {
    title: 'Change',
    dataIndex: 'change',
    key: 'change',
    render: (change: number, record: StockWithUI) => (
      <span className={change >= 0 ? styles.changePositive : styles.changeNegative}>
        {change >= 0 ? '+' : ''}${change.toFixed(2)} ({record.changesPercentage.toFixed(2)}%)
        {change >= 0 ? (
          <ArrowUpOutlined className={styles.changeIcon} />
        ) : (
          <ArrowDownOutlined className={styles.changeIcon} />
        )}
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_: unknown, record: StockWithUI) => (
      <Button
        variant="primary"
        icon={<PlusOutlined />}
        onClick={() => openAddModalFromStock(record)}
        disabled={!authStore.isAuthenticated}
        size="medium"
      >
        Add to Portfolio
      </Button>
    ),
  },
];

export const createSearchColumns = (
  openAddModal: (stock: SearchResultWithUI) => void
): ColumnsType<SearchResultWithUI> => [
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
    title: 'Company Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_: unknown, record: SearchResultWithUI) => (
      <Button
        variant="primary"
        icon={<PlusOutlined />}
        onClick={() => openAddModal(record)}
        disabled={!authStore.isAuthenticated}
        size="medium"
      >
        Add to Portfolio
      </Button>
    ),
  },
];

export const createStocksTabs = (
  stockColumns: ColumnsType<StockWithUI>,
  searchColumns: ColumnsType<SearchResultWithUI>,
  onInputSearch: (value: string) => void
) => [
  {
    key: 'gainers',
    label: (
      <span>
        <ArrowUpOutlined className={styles.tabIconGainers} />
        Top Gainers
      </span>
    ),
    children: (
      <Table
        columns={stockColumns}
        data={stocksStore.currentGainersData}
        rowKey={(record: StockWithUI) => record._id || `gainers-${record.symbol || 'unknown'}`}
        pagination={{
          current: stocksStore.gainersCurrentPage,
          pageSize: stocksStore.PAGE_SIZE,
          total: stocksStore.gainersTotal,
          onChange: (page: number) => stocksStore.loadGainersPage(page),
          showSizeChanger: false,
        }}
        loading={stocksStore.loading}
      />
    ),
  },
  {
    key: 'losers',
    label: (
      <span>
        <ArrowDownOutlined className={styles.tabIconLosers} />
        Top Losers
      </span>
    ),
    children: (
      <Table
        columns={stockColumns}
        data={stocksStore.currentLosersData}
        rowKey={(record: StockWithUI) => record._id || `losers-${record.symbol || 'unknown'}`}
        pagination={{
          current: stocksStore.losersCurrentPage,
          pageSize: stocksStore.PAGE_SIZE,
          total: stocksStore.losersTotal,
          onChange: (page: number) => stocksStore.loadLosersPage(page),
          showSizeChanger: false,
        }}
        loading={stocksStore.loading}
      />
    ),
  },
  {
    key: 'search',
    label: (
      <span>
        <SearchOutlined />
        Search Stocks
      </span>
    ),
    children: (
      <div>
        <div className={styles.searchInputContainer}>
          <SearchInput onChange={onInputSearch} />
        </div>
        <Table
          columns={searchColumns}
          data={stocksStore.searchResults}
          rowKey={(record: SearchResultWithUI) =>
            record._id || `search-${record.symbol || 'unknown'}`
          }
          pagination={{ pageSize: 30 }}
          loading={stocksStore.searchLoading}
          emptyText={
            stocksStore.searchQuery && !stocksStore.showingAllStocks
              ? 'No stocks found'
              : stocksStore.showingAllStocks
                ? 'All available stocks'
                : 'Loading stocks...'
          }
        />
      </div>
    ),
  },
];
