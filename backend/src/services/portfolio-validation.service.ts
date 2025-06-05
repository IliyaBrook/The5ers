import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PortfolioValidationService {
  validateSymbol(symbol: string): string {
    if (!symbol || typeof symbol !== 'string') {
      throw new BadRequestException('Symbol is required and must be a string');
    }

    const cleanSymbol = symbol.trim().toUpperCase();

    if (cleanSymbol.length === 0) {
      throw new BadRequestException('Symbol cannot be empty');
    }

    if (cleanSymbol.length > 10) {
      throw new BadRequestException('Symbol cannot be longer than 10 characters');
    }

    if (!/^[A-Z0-9]+$/.test(cleanSymbol)) {
      throw new BadRequestException('Symbol must contain only letters and numbers');
    }

    return cleanSymbol;
  }

  validateQuantity(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }

    if (quantity > 1000000) {
      throw new BadRequestException('Quantity cannot exceed 1,000,000 shares');
    }
  }

  validatePrice(price: number): void {
    if (!Number.isFinite(price) || price < 0) {
      throw new BadRequestException('Price must be a non-negative number');
    }

    if (price > 1000000) {
      throw new BadRequestException('Price cannot exceed $1,000,000 per share');
    }
  }

  validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('User ID is required');
    }
  }
}
