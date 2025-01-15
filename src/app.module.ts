import { Module } from '@nestjs/common';
import { PrismaModule } from './config/database/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
