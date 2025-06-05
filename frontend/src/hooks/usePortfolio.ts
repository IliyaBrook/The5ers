import { useState } from 'react';
import { App } from 'antd';
import { authStore } from '@/stores/AuthStore';
import { portfolioService } from '@/services/portfolioService';

export interface AddToPortfolioData {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

export interface StockForPortfolio {
  symbol: string;
  name: string;
  _id?: string;
}

export const usePortfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockForPortfolio | null>(null);
  const { message } = App.useApp();

  const openAddModal = (stock: StockForPortfolio) => {
    if (!authStore.isAuthenticated) {
      message.error('Please log in to add stocks to your portfolio');
      return;
    }
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const addToPortfolio = async (data: AddToPortfolioData): Promise<boolean> => {
    const result = await portfolioService.addStock(data);

    if (result.success) {
      message.success(result.message || `${data.symbol} added to your portfolio!`);
      closeModal();
      return true;
    } else {
      message.error(result.message || 'Failed to add stock to portfolio');
      return false;
    }
  };

  return {
    isModalOpen,
    selectedStock,
    openAddModal,
    closeModal,
    addToPortfolio,
    isAuthenticated: authStore.isAuthenticated,
  };
};
