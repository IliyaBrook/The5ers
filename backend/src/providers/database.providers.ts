import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RefreshToken,
  RefreshTokenSchema,
  User,
  UserSchema,
  PortfolioStock,
  PortfolioStockSchema,
} from '@/schemas';
import type { EnvironmentVariables } from '@/types';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbUrl = configService.get<EnvironmentVariables['DB_URL']>('DB_URL');
      return {
        uri: dbUrl,
      };
    },
  }),
  MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    },
    {
      name: RefreshToken.name,
      schema: RefreshTokenSchema,
    },
    {
      name: PortfolioStock.name,
      schema: PortfolioStockSchema,
    },
  ]),
];
