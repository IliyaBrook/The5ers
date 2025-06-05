import { httpClient } from '@/services/httpClient';
import type {
  IFmpExtendedCompanyProfile,
  IStockQuoteDisplay,
} from '@the5ers-stocks-app/shared-types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

class CompanyService {
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

  async getExtendedProfile(symbol: string): Promise<ApiResponse<IFmpExtendedCompanyProfile>> {
    try {
      const response = await httpClient.get(
        `${this.baseUrl}/extended-profile/${symbol.toUpperCase()}`
      );
      return this.handleResponse<IFmpExtendedCompanyProfile>(response);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return {
        success: false,
        message: 'An error occurred while fetching company data',
      };
    }
  }

  transformProfileToQuote(profile: IFmpExtendedCompanyProfile): IStockQuoteDisplay {
    return {
      symbol: profile.symbol,
      name: profile.companyName,
      price: profile.price,
      changesPercentage: profile.changePercentage,
      change: profile.change,
      marketCap: profile.marketCap || profile.mktCap || 0,
      exchange: profile.exchange,
      volume: profile.volume,
      avgVolume: profile.averageVolume || profile.volAvg || 0,
    };
  }
}

export const companyService = new CompanyService();
