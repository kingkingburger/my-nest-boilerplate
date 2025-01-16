import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export function createWinstonLoggerConfig(env: string) {
  // 환경에 따라 로깅 레벨을 달리 설정
  const logLevel = env === 'production' ? 'info' : 'debug';

  return {
    level: logLevel,
    // 여러 개의 transport 설정
    transports: [
      // 콘솔 출력
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('BoilerPlate', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      // 날짜별 로그 파일 회전
      new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d', // 7일 후 삭제
        zippedArchive: true, // 파일을 압축하여 저장
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
    // 에러를 별도 파일로 저장하고 싶다면 추가 transport 설정 가능
    exceptionHandlers: [
      new winston.transports.File({
        dirname: 'logs',
        filename: 'exceptions.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
    exitOnError: false,
  };
}
