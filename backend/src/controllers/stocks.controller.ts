import { Controller, Get, Query, Param } from '@nestjs/common';
import { StocksService } from '../services/stocks.service';
import type {
  IFmpQuote,
  IFmpCompanyProfile,
  IFmpSearchResult,
  IFmpHistoricalPrice,
  IFmpBiggestMover,
  IFmpExtendedCompanyProfile,
} from '@the5ers-stocks-app/shared-types';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('search')
  async searchStocks(
    @Query('query') query: string,
    @Query('limit') limit?: number
  ): Promise<IFmpSearchResult[]> {
    const searchLimit = limit ? parseInt(limit.toString(), 10) : 10;
    return this.stocksService.searchStocks(query, searchLimit);
  }

  @Get('quote/:symbol')
  async getQuote(@Param('symbol') symbol: string): Promise<IFmpQuote | null> {
    return this.stocksService.getQuote(symbol);
  }

  @Get('profile/:symbol')
  async getCompanyProfile(@Param('symbol') symbol: string): Promise<IFmpCompanyProfile | null> {
    return this.stocksService.getCompanyProfile(symbol);
  }

  @Get('extended-profile/:symbol')
  async getExtendedCompanyProfile(
    @Param('symbol') symbol: string
  ): Promise<IFmpExtendedCompanyProfile | null> {
    return this.stocksService.getExtendedCompanyProfile(symbol);
  }

  @Get('movers')
  async getMarketMovers(
    @Query('type') type: 'gainers' | 'losers' = 'gainers'
  ): Promise<IFmpBiggestMover[]> {
    return this.stocksService.getMarketMovers(type);
  }

  @Get('quotes')
  async getBatchQuotes(@Query('symbols') symbols: string): Promise<IFmpQuote[]> {
    const symbolsArray = symbols.split(',').filter(s => s.trim());
    return this.stocksService.getBatchQuotes(symbolsArray);
  }

  @Get('historical/:symbol')
  async getHistoricalPrices(
    @Param('symbol') symbol: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ): Promise<IFmpHistoricalPrice[]> {
    return this.stocksService.getHistoricalPrices(symbol, from, to);
  }
}
