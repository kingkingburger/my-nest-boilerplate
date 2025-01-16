import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './config/interceptor/transform-response.interceptor';
import { HttpExceptionFilter } from './config/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 기본 CORS 활성화
  app.enableCors();

  app.useGlobalInterceptors(new TransformResponseInterceptor()); // 전역 Interceptor 등록
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 Filter 등록
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // DTO에 정의되지 않은 속성 제거
      // forbidNonWhitelisted: true, // 정의되지 않은 속성 포함 시 에러 발생
      transform: true, // 요청 객체를 자동으로 DTO 클래스 인스턴스로 변환
    }),
  ); // class validator 처리

  // swagger 적용
  const config = new DocumentBuilder()
    .setTitle('playground')
    .setDescription('just fun')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
