import React from 'react';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface TableProps<T = any> extends Omit<AntTableProps<T>, 'columns'> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  pagination?: AntTableProps<T>['pagination'];
  onRowClick?: (record: T, index: number) => void;
  rowKey?: string | ((record: T) => string);
  emptyText?: string;
  className?: string;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onRowClick,
  rowKey = 'id',
  emptyText,
  className,
  ...props
}: TableProps<T>) => {
  const handleRow = (record: T, index?: number) => ({
    onClick: () => onRowClick?.(record, index || 0),
    style: onRowClick ? { cursor: 'pointer' } : {},
  });

  return (
    <AntTable<T>
      className={className}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      rowKey={rowKey}
      onRow={onRowClick ? handleRow : undefined}
      locale={{ emptyText: emptyText || 'No data available' }}
      {...props}
    />
  );
};

Table.displayName = 'Table';

export default Table;
