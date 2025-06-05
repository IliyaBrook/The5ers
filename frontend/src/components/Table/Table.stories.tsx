import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Table from './Table';
import type { ColumnsType } from 'antd/es/table';

interface MockData {
  id: string;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}

const mockData: MockData[] = [
  { id: '1', name: 'John Doe', age: 30, email: 'john@example.com', status: 'active' },
  { id: '2', name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'inactive' },
  { id: '3', name: 'Bob Johnson', age: 35, email: 'bob@example.com', status: 'active' },
];

const meta: Meta<typeof Table<MockData>> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    loading: { control: 'boolean' },
    onRowClick: { action: 'row-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Table<MockData>>;

const basicColumns: ColumnsType<MockData> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    align: 'center',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <span
        style={{
          color: status === 'active' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold',
        }}
      >
        {status.toUpperCase()}
      </span>
    ),
  },
];

export const Default: Story = {
  args: {
    columns: basicColumns,
    data: mockData,
    rowKey: 'id',
  },
};

export const Loading: Story = {
  args: {
    columns: basicColumns,
    data: [],
    loading: true,
    rowKey: 'id',
  },
};

export const Empty: Story = {
  args: {
    columns: basicColumns,
    data: [],
    emptyText: 'No records found',
    rowKey: 'id',
  },
};

export const WithPagination: Story = {
  args: {
    columns: basicColumns,
    data: [...mockData, ...mockData, ...mockData],
    pagination: {
      pageSize: 2,
      showSizeChanger: true,
      showQuickJumper: true,
    },
    rowKey: 'id',
  },
};

export const Clickable: Story = {
  args: {
    columns: basicColumns,
    data: mockData,
    onRowClick: action('row-clicked'),
    rowKey: 'id',
  },
};
