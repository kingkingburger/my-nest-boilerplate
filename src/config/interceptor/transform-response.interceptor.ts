import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { makeResponseSuccess, ResponseType } from '../../util/app.response';

/*
  ========== 7) 성공 응답 전역 처리 - Interceptor ==========
  - 컨트롤러에서 return한 값을 가로채서 makeResponseSuccess로 감싸줌
  - 필요하다면 type을 어떻게 정할지 로직 추가(컨트롤러에서 정해줘도 되고, 여기서 data 분석해도 됨)
*/
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // data: 컨트롤러가 return한 값
        // 여기서는 그냥 FREESTYLE로 통일해서 예시
        return makeResponseSuccess(data, ResponseType.FREESTYLE);
      }),
    );
  }
}
