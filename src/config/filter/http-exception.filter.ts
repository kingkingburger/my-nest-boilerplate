/*
  ========== 8) 에러 응답 전역 처리 - Exception Filter ==========
  - throw new HttpException(...) 또는 알 수 없는 예외가 발생했을 때
  - makeResponseError()로 감싸서 응답
*/
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { makeResponseError } from '../../util/app.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resJson = makeResponseError(exception);
      response.status(status).json(resJson);
    } else {
      const resJson = makeResponseError(exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(resJson);
    }
  }
}
