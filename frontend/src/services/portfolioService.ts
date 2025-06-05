import { authStore } from '@/stores/AuthStore';
import type { IPortfolioStockWithQuote } from '@the5ers-stocks-app/shared-types';
import { httpClient } from '@/services/httpClient';

export interface AddToPortfolioRequest {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

class PortfolioService {
  private readonly baseUrl = '/api/portfolio';

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }

    if (response.status === 401) {
      return {
        success: false,
        message: 'Session expired. Please log in again.',
      };
    }

    try {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'An error occurred',
      };
    } catch {
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async getPortfolioWithQuotes(): Promise<ApiResponse<IPortfolioStockWithQuote[]>> {
    if (!authStore.isAuthenticated) {
      return {
        success: false,
        message: 'Please log in to view your portfolio',
      };
    }

    try {
      const response = await httpClient.get(`${this.baseUrl}/with-quotes`);
      return this.handleResponse<IPortfolioStockWithQuote[]>(response);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return {
        success: false,
        message: 'An error occurred while fetching portfolio data',
      };
    }
  }

  async addStock(request: AddToPortfolioRequest): Promise<ApiResponse> {
    if (!authStore.isAuthenticated) {
      return {
        success: false,
        message: 'Please log in to add stocks to your portfolio',
      };
    }

    try {
      const response = await httpClient.post(`${this.baseUrl}/stocks`, request);
      const result = await this.handleResponse(response);
      if (result.success) {
        result.message = `${request.symbol} added to your portfolio!`;
      }
      return result;
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
      return {
        success: false,
        message: 'An error occurred while adding stock to portfolio',
      };
    }
  }

  async removeStock(symbol: string): Promise<ApiResponse> {
    if (!authStore.isAuthenticated) {
      return {
        success: false,
        message: 'Please log in to remove stocks from your portfolio',
      };
    }

    try {
      const response = await httpClient.delete(`${this.baseUrl}/stocks/${symbol}`);
      const result = await this.handleResponse(response);
      if (result.success) {
        result.message = `${symbol} removed from your portfolio!`;
      }
      return result;
    } catch (error) {
      console.error('Error removing stock from portfolio:', error);
      return {
        success: false,
        message: 'An error occurred while removing stock from portfolio',
      };
    }
  }
}

export const portfolioService = new PortfolioService();
