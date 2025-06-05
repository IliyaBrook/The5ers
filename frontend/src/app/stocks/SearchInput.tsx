import { useDebounce } from '@/hooks/useDebounce';
import { Input } from 'antd';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  onChange: (value: string) => void;
}

export const SearchInput = ({ onChange }: SearchInputProps) => {
  const [value, setValue] = useState<string>('');

  const debouncedValue = useDebounce<string>(value, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    onChange(value);
  }, [debouncedValue]);

  return (
    <Input
      placeholder="Search for stocks (e.g., AAPL, Apple)"
      allowClear
      value={value}
      size="large"
      onChange={handleChange}
    />
  );
};
