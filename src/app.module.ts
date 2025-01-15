import { Module } from '@nestjs/common';
import { PrismaModule } from './config/database/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './api/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
