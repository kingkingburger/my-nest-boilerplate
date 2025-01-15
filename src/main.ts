import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './config/interceptor/transform-response.interceptor';
import { HttpExceptionFilter } from './config/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 기본 CORS 활성화
  app.enableCors();

  // 전역 Interceptor 등록
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // 전역 Filter 등록
  app.useGlobalFilters(new HttpExceptionFilter());

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
