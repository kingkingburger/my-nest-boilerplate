import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Observable, tap } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const { method, url, headers, body, query } = request;

    // 예: 요청마다 고유 ID를 생성하여 로깅할 때 사용(혹은 X-Correlation-ID를 헤더로 전달받으면 활용)
    const correlationId = headers['x-correlation-id'] || randomUUID();

    const now = Date.now();

    // 요청 로그
    this.logger.info('Incoming Request', {
      correlationId,
      method,
      url,
      query,
      body,
    });

    return next.handle().pipe(
      tap((responseData) => {
        const delay = Date.now() - now;
        // 응답 로그
        this.logger.info('Outgoing Response', {
          correlationId,
          method,
          url,
          responseTime: `${delay}ms`,
          responseData,
        });
      }),
    );
  }
}
