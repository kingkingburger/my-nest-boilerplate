import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // class-validator 에러를 우선 처리
    const err = exception.getResponse() as {
      statusCode: number;
      message: any;
      response: Record<string, any>;
    };

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status: status,
      timestamp: new Date(),
      path: request?.url,
      method: request?.method,
      data: response?.data || null,
      message: err.message ? err.message : response?.message,
      remark: response?.remark,
    };

    // 로그 남기기
    this.logger.error('HTTP Exception', errorResponse);

    response.status(status).json(errorResponse);
  }
}
