import { httpClient } from '@/services/httpClient';
import type { IFmpSearchResult } from '@the5ers-stocks-app/shared-types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface MarketMoversData {
  gainers: any[];
  losers: any[];
}

class StocksService {
  private readonly baseUrl = '/api/stocks';

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
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

  async getMarketMovers(): Promise<ApiResponse<MarketMoversData>> {
    try {
      const [gainersResponse, losersResponse] = await Promise.all([
        httpClient.get(`${this.baseUrl}/movers?type=gainers`),
        httpClient.get(`${this.baseUrl}/movers?type=losers`),
      ]);

      if (gainersResponse.ok && losersResponse.ok) {
        const gainers = await gainersResponse.json();
        const losers = await losersResponse.json();

        return {
          success: true,
          data: { gainers, losers },
        };
      } else {
        return {
          success: false,
          message: 'Failed to fetch market movers data',
        };
      }
    } catch (error) {
      console.error('Error fetching market movers:', error);
      return {
        success: false,
        message: 'An error occurred while fetching market data',
      };
    }
  }

  async searchStocks(query: string): Promise<ApiResponse<IFmpSearchResult[]>> {
    if (!query.trim()) {
      return {
        success: true,
        data: [],
      };
    }

    try {
      const response = await httpClient.get(
        `${this.baseUrl}/search?query=${encodeURIComponent(query)}`
      );
      return this.handleResponse<IFmpSearchResult[]>(response);
    } catch (error) {
      console.error('Error searching stocks:', error);
      return {
        success: false,
        message: 'An error occurred while searching stocks',
      };
    }
  }

  async getExtendedProfile(symbol: string): Promise<ApiResponse<any>> {
    try {
      const response = await httpClient.get(
        `${this.baseUrl}/extended-profile/${symbol.toUpperCase()}`
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching stock profile:', error);
      return {
        success: false,
        message: 'An error occurred while fetching stock data',
      };
    }
  }
}

export const stocksService = new StocksService();
