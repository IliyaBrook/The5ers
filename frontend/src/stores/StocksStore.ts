import { makeAutoObservable, runInAction } from 'mobx';
import type { IFmpSearchResult } from '@the5ers-stocks-app/shared-types';
import { stocksService } from '@/services/stocksService';


export interface StockWithUI {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
  marketCap?: number;
  volume?: number;
  _id?: string;
}

export interface SearchResultWithUI extends IFmpSearchResult {
  _id?: string;
}

interface PaginatedData {
  [page: number]: StockWithUI[];
}

export class StocksStore {
  allGainersData: StockWithUI[] = [];
  allLosersData: StockWithUI[] = [];

  gainersCache: PaginatedData = {};
  losersCache: PaginatedData = {};

  gainersCurrentPage = 1;
  losersCurrentPage = 1;

  
  searchResults: SearchResultWithUI[] = [];
  searchQuery = '';
  showingAllStocks = false;

  sortBy: 'price' | 'change' | 'volume' | 'marketCap' = 'change';
  filterBy: 'all' | '0-10' | '10-20' | '20-30' | '30-40' | '40-50' | '50-60' | '60-70' | 'above70' = 'all';

  loading = false;
  searchLoading = false;

  PAGE_SIZE = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMarketMovers() {
    if (this.loading) return;

    runInAction(() => {
      this.loading = true;
    });

    try {
      const result = await stocksService.getMarketMovers();

      if (result.success && result.data) {
        runInAction(() => {
          this.allGainersData = this.normalizeStockData(result.data!.gainers, 'gainers');
          this.allLosersData = this.normalizeStockData(result.data!.losers, 'losers');

          this.gainersCache = {};
          this.losersCache = {};

          this.loadGainersPage(1);
          this.loadLosersPage(1);
        });
      } else {
        throw new Error(result.message || 'Failed to fetch market movers data');
      }
    } catch (error) {
      console.error('Error fetching market movers:', error);
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  normalizeStockData(data: any[], type: string): StockWithUI[] {
    if (!Array.isArray(data)) return [];

    return data.map((stock, index) => ({
      ...stock,
      symbol: stock.symbol || 'N/A',
      price: typeof stock.price === 'string' ? parseFloat(stock.price) : stock.price || 0,
      change: stock.change || 0,
      changesPercentage:
        typeof stock.changesPercentage === 'string'
          ? parseFloat(stock.changesPercentage)
          : stock.changesPercentage || 0,
      _id: `${type}-${stock.symbol || index}`,
    }));
  }

  applyFilters(stocks: StockWithUI[]): StockWithUI[] {
    let filtered = [...stocks];

    
    switch (this.filterBy) {
      case '0-10':
        filtered = filtered.filter(stock => stock.price >= 0 && stock.price < 10);
        break;
      case '10-20':
        filtered = filtered.filter(stock => stock.price >= 10 && stock.price < 20);
        break;
      case '20-30':
        filtered = filtered.filter(stock => stock.price >= 20 && stock.price < 30);
        break;
      case '30-40':
        filtered = filtered.filter(stock => stock.price >= 30 && stock.price < 40);
        break;
      case '40-50':
        filtered = filtered.filter(stock => stock.price >= 40 && stock.price < 50);
        break;
      case '50-60':
        filtered = filtered.filter(stock => stock.price >= 50 && stock.price < 60);
        break;
      case '60-70':
        filtered = filtered.filter(stock => stock.price >= 60 && stock.price < 70);
        break;
      case 'above70':
        filtered = filtered.filter(stock => stock.price >= 70);
        break;
    }

    
    switch (this.sortBy) {
      case 'price':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'change':
        filtered.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        break;
      case 'volume':
        filtered.sort((a, b) => (b.volume || 0) - (a.volume || 0));
        break;
      case 'marketCap':
        filtered.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
        break;
    }

    return filtered;
  }

  loadGainersPage(page: number) {
    if (this.gainersCache[page]) {
      this.gainersCurrentPage = page;
      return;
    }

    const filteredData = this.applyFilters(this.allGainersData);
    const startIndex = (page - 1) * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;
    const pageData = filteredData.slice(startIndex, endIndex);

    runInAction(() => {
      this.gainersCache[page] = pageData;
      this.gainersCurrentPage = page;
    });
  }

  loadLosersPage(page: number) {
    if (this.losersCache[page]) {
      this.losersCurrentPage = page;
      return;
    }

    const filteredData = this.applyFilters(this.allLosersData);
    const startIndex = (page - 1) * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;
    const pageData = filteredData.slice(startIndex, endIndex);

    runInAction(() => {
      this.losersCache[page] = pageData;
      this.losersCurrentPage = page;
    });
  }

  get currentGainersData(): StockWithUI[] {
    return this.gainersCache[this.gainersCurrentPage] || [];
  }

  get currentLosersData(): StockWithUI[] {
    return this.losersCache[this.losersCurrentPage] || [];
  }

  get gainersTotal(): number {
    return this.applyFilters(this.allGainersData).length;
  }

  get losersTotal(): number {
    return this.applyFilters(this.allLosersData).length;
  }

  setFilters(sortBy?: typeof this.sortBy, filterBy?: typeof this.filterBy) {
    runInAction(() => {
      if (sortBy) this.sortBy = sortBy;
      if (filterBy) this.filterBy = filterBy;

      
      this.gainersCache = {};
      this.losersCache = {};

      
      this.loadGainersPage(this.gainersCurrentPage);
      this.loadLosersPage(this.losersCurrentPage);
    });
  }

  showAllStocksForSearch() {
    const allStocks = [...this.allGainersData, ...this.allLosersData];
    runInAction(() => {
      this.searchResults = allStocks.map((stock, index) => ({
        symbol: stock.symbol,
        name: stock.name,
        currency: 'USD',
        stockExchange: 'N/A',
        exchangeShortName: 'N/A',
        _id: `all-${index}-${stock.symbol || 'unknown'}`,
      }));
      this.searchQuery = '';
      this.showingAllStocks = true;
    });
  }

  async searchStocks(query: string) {
    if (!query.trim()) {
      this.showAllStocksForSearch();
      return;
    }

    runInAction(() => {
      this.searchLoading = true;
      this.searchQuery = query;
      this.showingAllStocks = false;
    });

    try {
      const allStocks = [...this.allGainersData, ...this.allLosersData];
      const localResults = allStocks.filter(
        stock =>
          stock.name?.toLowerCase().includes(query.toLowerCase()) ||
          stock.symbol?.toLowerCase().includes(query.toLowerCase())
      );

      const result = await stocksService.searchStocks(query);

      let apiResults: any[] = [];
      if (result.success && result.data) {
        apiResults = result.data;
      }

      runInAction(() => {
        const localMapped = localResults.map((stock, index) => ({
          symbol: stock.symbol,
          name: stock.name,
          currency: 'USD',
          stockExchange: 'N/A',
          exchangeShortName: 'N/A',
          _id: `local-${index}-${stock.symbol || 'unknown'}`,
        }));

        const apiMapped = Array.isArray(apiResults)
          ? apiResults.map((result, index) => ({
              ...result,
              _id: `api-${index}-${result.symbol || 'unknown'}`,
            }))
          : [];

        
        const combined = [...localMapped, ...apiMapped];
        const uniqueResults = combined.filter(
          (stock, index, self) => index === self.findIndex(s => s.symbol === stock.symbol)
        );

        this.searchResults = uniqueResults;
      });
    } catch (error) {
      console.error('Error searching stocks:', error);
      runInAction(() => {
        this.searchResults = [];
      });
      throw error;
    } finally {
      runInAction(() => {
        this.searchLoading = false;
      });
    }
  }
}

export const stocksStore = new StocksStore();
