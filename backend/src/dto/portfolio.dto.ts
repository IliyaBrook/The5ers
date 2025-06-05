import { IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { IPortfolioStock } from '@the5ers-stocks-app/shared-types';

export class AddStockDto {
  @IsString()
  symbol: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @Min(0)
  averagePrice: number;
}

export class UpdateStockDto {
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsNumber()
  @Min(0)
  averagePrice?: number;
}

export class PortfolioStockDto implements Omit<IPortfolioStock, 'userId'> {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  addedAt: Date;
  updatedAt: Date;

  constructor(portfolioStock: IPortfolioStock) {
    this.id = portfolioStock.id;
    this.symbol = portfolioStock.symbol;
    this.quantity = portfolioStock.quantity;
    this.averagePrice = portfolioStock.averagePrice;
    this.addedAt = portfolioStock.addedAt;
    this.updatedAt = portfolioStock.updatedAt;
  }
}
