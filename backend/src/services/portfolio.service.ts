import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PortfolioStock, TPortfolioStockDocument } from '../schemas/portfolio';
import { AddStockDto, UpdateStockDto, PortfolioStockDto } from '../dto/portfolio.dto';
import { StocksService } from './stocks.service';
import { PortfolioCalculationsService } from './portfolio-calculations.service';
import { IPortfolioStockWithQuote } from '@the5ers-stocks-app/shared-types';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @InjectModel(PortfolioStock.name)
    private readonly portfolioStockModel: Model<TPortfolioStockDocument>,
    private readonly stocksService: StocksService,
    private readonly calculationsService: PortfolioCalculationsService
  ) {}

  async getUserPortfolio(userId: string): Promise<PortfolioStockDto[]> {
    const stocks = await this.portfolioStockModel.find({ userId }).exec();
    return stocks.map(
      stock =>
        new PortfolioStockDto({
          id: stock.id,
          userId: stock.userId.toString(),
          symbol: stock.symbol,
          quantity: stock.quantity,
          averagePrice: stock.averagePrice,
          addedAt: stock.addedAt,
          updatedAt: stock.updatedAt,
        })
    );
  }

  async getUserPortfolioWithQuotes(userId: string): Promise<IPortfolioStockWithQuote[]> {
    const stocks = await this.portfolioStockModel.find({ userId }).exec();

    if (stocks.length === 0) {
      return [];
    }

    this.logger.debug(`Fetching quotes for ${stocks.length} stocks for user ${userId}`);

    const stocksWithQuotes = await Promise.all(
      stocks.map(async stock => {
        try {
          const profile = await this.stocksService.getExtendedCompanyProfile(stock.symbol);
          const currentPrice = profile?.price || 0;

          this.logger.debug(
            `${stock.symbol}: currentPrice=${currentPrice}, averagePrice=${stock.averagePrice}, quantity=${stock.quantity}`
          );

          const calculations = this.calculationsService.calculateStockMetrics(
            stock.quantity,
            stock.averagePrice,
            currentPrice
          );

          return {
            id: stock.id,
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            currentPrice,
            ...calculations,
            addedAt: stock.addedAt,
            updatedAt: stock.updatedAt,
          };
        } catch (error) {
          this.logger.error(`Error fetching data for ${stock.symbol}:`, error);

          const calculations = this.calculationsService.calculateStockMetrics(
            stock.quantity,
            stock.averagePrice,
            0
          );

          return {
            id: stock.id,
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            currentPrice: 0,
            ...calculations,
            addedAt: stock.addedAt,
            updatedAt: stock.updatedAt,
          };
        }
      })
    );

    this.logger.debug(`Successfully processed ${stocksWithQuotes.length} stocks`);
    return stocksWithQuotes;
  }

  async addStockToPortfolio(userId: string, addStockDto: AddStockDto): Promise<PortfolioStockDto> {
    const { symbol, quantity, averagePrice } = addStockDto;

    const existingStock = await this.portfolioStockModel.findOne({ userId, symbol }).exec();

    if (existingStock) {
      const { newQuantity, newAveragePrice } = this.calculationsService.calculateAveragePrice(
        existingStock.quantity,
        existingStock.averagePrice,
        quantity,
        averagePrice
      );

      existingStock.quantity = newQuantity;
      existingStock.averagePrice = newAveragePrice;
      existingStock.updatedAt = new Date();

      const updatedStock = await existingStock.save();
      return new PortfolioStockDto({
        id: updatedStock.id,
        userId: updatedStock.userId.toString(),
        symbol: updatedStock.symbol,
        quantity: updatedStock.quantity,
        averagePrice: updatedStock.averagePrice,
        addedAt: updatedStock.addedAt,
        updatedAt: updatedStock.updatedAt,
      });
    } else {
      const newStock = new this.portfolioStockModel({
        userId,
        symbol: symbol.toUpperCase(),
        quantity,
        averagePrice,
      });

      const savedStock = await newStock.save();
      return new PortfolioStockDto({
        id: savedStock.id,
        userId: savedStock.userId.toString(),
        symbol: savedStock.symbol,
        quantity: savedStock.quantity,
        averagePrice: savedStock.averagePrice,
        addedAt: savedStock.addedAt,
        updatedAt: savedStock.updatedAt,
      });
    }
  }

  async updateStock(
    userId: string,
    symbol: string,
    updateStockDto: UpdateStockDto
  ): Promise<PortfolioStockDto> {
    const stock = await this.portfolioStockModel
      .findOne({ userId, symbol: symbol.toUpperCase() })
      .exec();

    if (!stock) {
      throw new NotFoundException(`Stock ${symbol} not found in portfolio`);
    }

    if (updateStockDto.quantity !== undefined) {
      stock.quantity = updateStockDto.quantity;
    }

    if (updateStockDto.averagePrice !== undefined) {
      stock.averagePrice = updateStockDto.averagePrice;
    }

    stock.updatedAt = new Date();
    const updatedStock = await stock.save();

    return new PortfolioStockDto({
      id: updatedStock.id,
      userId: updatedStock.userId.toString(),
      symbol: updatedStock.symbol,
      quantity: updatedStock.quantity,
      averagePrice: updatedStock.averagePrice,
      addedAt: updatedStock.addedAt,
      updatedAt: updatedStock.updatedAt,
    });
  }

  async removeStock(userId: string, symbol: string): Promise<boolean> {
    const result = await this.portfolioStockModel
      .deleteOne({
        userId,
        symbol: symbol.toUpperCase(),
      })
      .exec();

    return result.deletedCount > 0;
  }

  async getStock(userId: string, symbol: string): Promise<PortfolioStockDto | null> {
    const stock = await this.portfolioStockModel
      .findOne({
        userId,
        symbol: symbol.toUpperCase(),
      })
      .exec();

    if (!stock) {
      return null;
    }

    return new PortfolioStockDto({
      id: stock.id,
      userId: stock.userId.toString(),
      symbol: stock.symbol,
      quantity: stock.quantity,
      averagePrice: stock.averagePrice,
      addedAt: stock.addedAt,
      updatedAt: stock.updatedAt,
    });
  }

  async getStockOrThrow(userId: string, symbol: string): Promise<PortfolioStockDto> {
    const stock = await this.getStock(userId, symbol);

    if (!stock) {
      throw new NotFoundException(`Stock ${symbol} not found in portfolio`);
    }

    return stock;
  }

  async removeStockOrThrow(userId: string, symbol: string): Promise<{ message: string }> {
    const removed = await this.removeStock(userId, symbol);

    if (!removed) {
      throw new NotFoundException(`Stock ${symbol} not found in portfolio`);
    }

    return { message: `Stock ${symbol} removed from portfolio` };
  }
}
