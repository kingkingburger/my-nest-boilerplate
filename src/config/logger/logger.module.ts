import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { createWinstonLoggerConfig } from './logger.config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => {
        return createWinstonLoggerConfig(process.env.NODE_ENV || 'development');
      },
    }),
  ],
})
export class LoggerModule {}
