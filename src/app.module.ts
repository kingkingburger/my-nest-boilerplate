import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './config/database/prisma.module';
import { LoggerModule } from './config/logger/logger.module';
import { HttpExceptionFilter } from './config/filter/http-exception.filter';
import { PrismaExceptionFilter } from './config/filter/prisma-exception.filter';
import { HttpLoggerInterceptor } from './config/interceptor/http-logger.intercepter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [PrismaModule, LoggerModule, UserModule, AuthModule],
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
