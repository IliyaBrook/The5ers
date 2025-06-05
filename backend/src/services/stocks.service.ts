import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  IFmpQuote,
  IFmpCompanyProfile,
  IFmpSearchResult,
  IFmpHistoricalPrice,
  IFmpBiggestMover,
  IFmpExtendedCompanyProfile,
} from '@the5ers-stocks-app/shared-types';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://financialmodelingprep.com/stable';

  constructor(private readonly configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('FMP_API_KEY') || 'zSw89oAmBqblgVUDQrxzusSROillCLC4';
  }

  async searchStocks(query: string, limit: number = 10): Promise<IFmpSearchResult[]> {
    try {
      this.logger.debug(`Searching stocks with query: ${query}, limit: ${limit}`);
      
      const response = await fetch(
        `${this.baseUrl}/search-name?query=${encodeURIComponent(query)}&limit=${limit}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      this.logger.error('Error searching stocks:', error);
      return [];
    }
  }

  async getQuote(symbol: string): Promise<IFmpQuote | null> {
    try {
      const url = `${this.baseUrl}/quote/${symbol.toUpperCase()}?apikey=${this.apiKey}`;
      this.logger.debug(`Fetching quote for ${symbol}`);

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`FMP API error for quote ${symbol}: ${response.status} ${response.statusText}`);
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data) && data.length > 0 ? data[0] : null;
      
      this.logger.debug(`Quote result for ${symbol}: ${result ? 'Found' : 'Not found'}`);
      return result;
    } catch (error) {
      this.logger.error(`Error getting quote for ${symbol}:`, error);
      return null;
    }
  }

  async getCompanyProfile(symbol: string): Promise<IFmpCompanyProfile | null> {
    try {
      const url = `${this.baseUrl}/profile/${symbol.toUpperCase()}?apikey=${this.apiKey}`;
      this.logger.debug(`Fetching company profile for ${symbol}`);

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`FMP API error for company profile ${symbol}: ${response.status} ${response.statusText}`);
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data) && data.length > 0 ? data[0] : null;
      
      this.logger.debug(`Company profile result for ${symbol}: ${result ? 'Found' : 'Not found'}`);
      return result;
    } catch (error) {
      this.logger.error(`Error getting company profile for ${symbol}:`, error);
      return null;
    }
  }

  async getMarketMovers(type: 'gainers' | 'losers'): Promise<IFmpBiggestMover[]> {
    try {
      const endpoint = type === 'gainers' ? 'biggest-gainers' : 'biggest-losers';
      const url = `${this.baseUrl}/${endpoint}?apikey=${this.apiKey}`;

      this.logger.debug(`Fetching ${type} market movers`);

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.warn(`Primary endpoint failed for ${type}, trying fallback`);

        
        const fallbackEndpoint = type === 'gainers' ? 'gainers' : 'losers';
        const fallbackUrl = `${this.baseUrl}/${fallbackEndpoint}?apikey=${this.apiKey}`;

        const fallbackResponse = await fetch(fallbackUrl);

        if (!fallbackResponse.ok) {
          throw new Error(`FMP API error: ${response.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        return Array.isArray(fallbackData) ? fallbackData : [];
      }

      const data = await response.json();
      const result = Array.isArray(data) ? data : [];

      if (result.length === 0) {
        this.logger.debug(`Empty result from ${endpoint}, trying fallback...`);

        const fallbackEndpoint = type === 'gainers' ? 'gainers' : 'losers';
        const fallbackUrl = `${this.baseUrl}/${fallbackEndpoint}?apikey=${this.apiKey}`;

        const fallbackResponse = await fetch(fallbackUrl);

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return Array.isArray(fallbackData) ? fallbackData : [];
        }
      }

      return result;
    } catch (error) {
      this.logger.error(`Error getting ${type}:`, error);
      return [];
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<IFmpQuote[]> {
    if (symbols.length === 0) return [];

    try {
      const symbolsString = symbols.map(s => s.toUpperCase()).join(',');
      this.logger.debug(`Fetching batch quotes for symbols: ${symbolsString}`);
      
      const response = await fetch(`${this.baseUrl}/quote/${symbolsString}?apikey=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      this.logger.error('Error getting batch quotes:', error);
      return [];
    }
  }

  async getHistoricalPrices(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<IFmpHistoricalPrice[]> {
    try {
      const params = new URLSearchParams({ apikey: this.apiKey });
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      this.logger.debug(`Fetching historical prices for ${symbol}`);

      const response = await fetch(
        `${this.baseUrl}/historical-price-full/${symbol.toUpperCase()}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      return data.historical || [];
    } catch (error) {
      this.logger.error('Error getting historical prices:', error);
      return [];
    }
  }

  async getExtendedCompanyProfile(symbol: string): Promise<IFmpExtendedCompanyProfile | null> {
    try {
      const url = `${this.baseUrl}/profile?symbol=${symbol.toUpperCase()}&apikey=${this.apiKey}`;
      this.logger.debug(`Fetching extended profile for ${symbol}`);

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`FMP API error for extended profile ${symbol}: ${response.status} ${response.statusText}`);
        throw new Error(`FMP API error: ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data) && data.length > 0 ? data[0] : null;

      this.logger.debug(`Extended profile result for ${symbol}: ${result ? 'Found' : 'Not found'}`);
      return result;
    } catch (error) {
      this.logger.error(`Error getting extended profile for ${symbol}:`, error);
      return null;
    }
  }
}
