import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'minimal',
      log: [
        // emit을 'event'로 하면, 우리가 직접 $on('query') 이벤트를 통해 로그를 찍어요.
        // 만약 'stdout'으로 해두면 Prisma가 기본적으로 찍는 로그가 나오므로, 필터가 적용되지 않습니다.
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      // 스킵하고 싶은 쿼리 키워드를 배열로 만들어 둬요.
      const skipList = ['BEGIN', 'COMMIT', 'DEALLOCATE ALL'];

      // 이벤트에서 찍히는 쿼리가 skipList에 포함되면 무시
      if (skipList.some((keyword) => event.query.includes(keyword))) {
        return;
      }

      console.log(`\n=== Prisma Query Log ===`);
      console.log(`Query: ${event.query}`);
      console.log(`Params: ${event.params}`);
      console.log(`Duration: ${event.duration}ms`);
      console.log(`=========================\n`);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
