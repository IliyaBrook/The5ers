import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfolioService } from '../services/portfolio.service';
import { AddStockDto, UpdateStockDto } from '../dto/portfolio.dto';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getPortfolio(@Req() req: Request) {
    const userId = req['user'].id;
    return this.portfolioService.getUserPortfolio(userId);
  }

  @Get('with-quotes')
  async getPortfolioWithQuotes(@Req() req: Request) {
    const userId = req['user'].id;
    return this.portfolioService.getUserPortfolioWithQuotes(userId);
  }

  @Post('stocks')
  async addStock(@Req() req: Request, @Body() addStockDto: AddStockDto) {
    const userId = req['user'].id;
    return this.portfolioService.addStockToPortfolio(userId, addStockDto);
  }

  @Get('stocks/:symbol')
  async getStock(@Req() req: Request, @Param('symbol') symbol: string) {
    const userId = req['user'].id;
    return this.portfolioService.getStockOrThrow(userId, symbol);
  }

  @Put('stocks/:symbol')
  async updateStock(
    @Req() req: Request,
    @Param('symbol') symbol: string,
    @Body() updateStockDto: UpdateStockDto
  ) {
    const userId = req['user'].id;
    return this.portfolioService.updateStock(userId, symbol, updateStockDto);
  }

  @Delete('stocks/:symbol')
  async removeStock(@Req() req: Request, @Param('symbol') symbol: string) {
    const userId = req['user'].id;
    return this.portfolioService.removeStockOrThrow(userId, symbol);
  }
}
