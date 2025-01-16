import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
)
@Injectable()
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorCode: string;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `이미 존재하는 값입니다: ${JSON.stringify(exception.meta?.target)}`;
          errorCode = 'USER_CONFLICT';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = '데이터베이스 요청 중 오류가 발생했습니다.';
          errorCode = 'PRISMA_REQUEST_ERROR';
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      // Validation error handling
      status = HttpStatus.BAD_REQUEST;
      message = '잘못된 요청 파라미터입니다.';
      errorCode = 'INVALID_REQUEST_PARAMETERS';
    } else if (
      exception instanceof SyntaxError &&
      exception.message.includes('JSON')
    ) {
      // JSON 파싱 에러 처리
      status = HttpStatus.BAD_REQUEST;
      message = '요청 파라미터의 JSON 형식이 올바르지 않습니다.';
      errorCode = 'INVALID_JSON_FORMAT';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Prisma 클라이언트 초기화 중 에러발생';
      errorCode = 'INVALID_REQUEST_PARAMETERS';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Prisma 내부에서 Rust 패닉이 발생';
      errorCode = 'INVALID_REQUEST_PARAMETERS';
    } else {
      // 기타 예외 처리
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '서버 내부에서 오류가 발생했습니다.';
      errorCode = 'INTERNAL_SERVER_ERROR';
    }

    // 에러 로깅
    this.logger.error({
      message: exception.message,
      code: exception.code,
      meta: exception.meta,
      stack: exception.stack,
      path: request.url,
    });

    const apiError = {
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      remark: exception.stack,
    };

    response.status(status).json(apiError);
  }
}
