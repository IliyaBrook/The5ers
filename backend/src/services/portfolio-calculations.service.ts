import { Injectable } from '@nestjs/common';
import { IPortfolioStockWithQuote } from '@the5ers-stocks-app/shared-types';

export interface IPortfolioCalculation {
  currentValue: number;
  totalInvestment: number;
  gainLoss: number;
  gainLossPercent: number;
}

@Injectable()
export class PortfolioCalculationsService {
  calculateStockMetrics(
    quantity: number,
    averagePrice: number,
    currentPrice: number
  ): IPortfolioCalculation {
    const currentValue = currentPrice * quantity;
    const totalInvestment = averagePrice * quantity;
    const gainLoss = currentValue - totalInvestment;
    const gainLossPercent = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;

    return {
      currentValue,
      totalInvestment,
      gainLoss,
      gainLossPercent,
    };
  }

  calculatePortfolioTotals(stocks: IPortfolioStockWithQuote[]): {
    totalValue: number;
    totalInvestment: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
  } {
    const totals = stocks.reduce(
      (acc, stock) => {
        acc.totalValue += stock.currentValue;
        acc.totalInvestment += stock.totalInvestment;
        acc.totalGainLoss += stock.gainLoss;
        return acc;
      },
      {
        totalValue: 0,
        totalInvestment: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
      }
    );

    totals.totalGainLossPercent =
      totals.totalInvestment > 0 ? (totals.totalGainLoss / totals.totalInvestment) * 100 : 0;

    return totals;
  }

  calculateAveragePrice(
    existingQuantity: number,
    existingAveragePrice: number,
    newQuantity: number,
    newAveragePrice: number
  ): { newQuantity: number; newAveragePrice: number } {
    const totalQuantity = existingQuantity + newQuantity;
    const weightedAveragePrice =
      (existingAveragePrice * existingQuantity + newAveragePrice * newQuantity) / totalQuantity;

    return {
      newQuantity: totalQuantity,
      newAveragePrice: weightedAveragePrice,
    };
  }
}
