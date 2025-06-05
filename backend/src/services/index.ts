import { TokenService } from './token.service';
import { UserService } from './user.service';
import { PortfolioService } from './portfolio.service';
import { PortfolioCalculationsService } from './portfolio-calculations.service';
import { StocksService } from './stocks.service';

export { TokenService } from './token.service';
export { UserService } from './user.service';
export { PortfolioService } from './portfolio.service';
export { PortfolioCalculationsService } from './portfolio-calculations.service';
export { StocksService } from './stocks.service';

const services = [
  TokenService,
  UserService,
  PortfolioService,
  PortfolioCalculationsService,
  StocksService,
];
export default services;
