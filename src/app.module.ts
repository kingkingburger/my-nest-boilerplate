import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { PostgresModule } from './config/database/postgres/postgres.module';
import { LoggerModule } from './config/logger/logger.module';
import { HttpLoggerInterceptor } from './config/interceptor/http-logger.intercepter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { BoardModule } from './api/board/board.module';

@Module({
  imports: [PostgresModule, LoggerModule, UserModule, AuthModule, BoardModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule {}
