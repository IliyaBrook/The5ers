import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { controllers } from '@/controllers';
import guards from '@/guards';
import { configProvider, databaseProviders, jwtProvider } from '@/providers';
import services from '@/services';

const frontendAppPath = join(__dirname, '..', '..', 'frontend', 'build', 'frontend');

@Module({
  imports: [
    ...databaseProviders,
    configProvider,
    jwtProvider,
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: frontendAppPath,
          }),
        ]
      : []),
  ],

  controllers,

  providers: [...services, ...guards],
})
export class AppModule {}
