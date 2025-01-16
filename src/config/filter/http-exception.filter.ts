/*
  ========== 8) 에러 응답 전역 처리 - Exception Filter ==========
  - throw new HttpException(...) 또는 알 수 없는 예외가 발생했을 때
*/
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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

    response.status(status).json(errorResponse);
  }
}
