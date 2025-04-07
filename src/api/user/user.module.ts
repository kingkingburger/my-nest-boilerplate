import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/database/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '../../config/database/sequelize.module';
import { userProviders } from './user.providers';

@Module({
  imports: [
    // PrismaModule,
    SequelizeModule,
  ],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
