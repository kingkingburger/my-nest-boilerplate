import { Module } from '@nestjs/common';
import { sequelizeProviders } from './sequelize.provider';

@Module({
  providers: [...sequelizeProviders],
  exports: [...sequelizeProviders],
})
export class SequelizeModule {}
