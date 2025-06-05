
import { UserController } from './user.controller';
import { PortfolioController } from './portfolio.controller';
import { StocksController } from './stocks.controller';


export * from './user.controller';
export * from './portfolio.controller';
export * from './stocks.controller';
export const controllers = [UserController, PortfolioController, StocksController];
