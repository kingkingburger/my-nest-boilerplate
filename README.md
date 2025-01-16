## Docker로 postgres db 설치하기

```bash
docker-compose -f docker-compose-postgres.yaml -p local_db up -d
```

🟦 옵션
- -f: 특정 파일을 target으로 함
- -p: docker 프로젝트 이름을 설정할 수 있게 함
- -d: 백그라운드로 실행함

🟦 특징
- 프로젝트 root 폴더에 volume이 mount됨(db폴더)


## Prima 사용하기

1. Prisma 설치

Prisma CLI와 Prisma Client를 설치합니다.
```bash
npm install prisma --save-dev
npm install @prisma/client
```

2. Prisma 초기화
```bash
npx prisma init
```

3. .env 파일 수정
```sql
# .env

DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"
```

4. Prisma 스키마 정의
Prisma 스키마 파일(prisma/schema.prisma)을 열어 데이터베이스 모델을 정의합니다. 예를 들어, 간단한 user 모델을 추가해 보겠습니다.
```sql
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model user {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @default(now())
  deletedAt DateTime?
}
```

5. 데이터베이스 마이그레이션 실행
Prisma를 사용하여 데이터베이스에 스키마를 반영합니다.

```bash
npx prisma migrate dev --name init
```
이 명령어는 다음을 수행합니다:
- prisma/migrations 폴더에 마이그레이션 파일을 생성합니다.
- PostgreSQL 데이터베이스에 스키마를 적용합니다.
- Prisma Client를 생성합니다.

#### Prisma CLI 유용한 명령어

🟦 스키마 검증
```bash
npx prisma validate
```

🟦 Prisma Client 재생성
```bash
npx prisma generate
```

🟦 마이그레이션 상태 확인
```bash
npx prisma migrate status
```

🟦 마이그레이션 롤백
```bash
npx prisma migrate reset
```

### 폴더설명

🟦 api

- auth
  - authGuard
    - header에 authorization의 jwt 토큰이 있어야해요
    - 사용법: endpoint 에 `@UseGuards(AuthGuard)` 을 넣으면 되요. 그러면 해당 endpoint는 jwt토큰이 필요하게 되요.
- user
  - prisma를 활용한 curd작업이 되어있어요.

🟦 util
- 유저의 password를 hashing 시켜주는 hash 유틸이 있어요. 
  - 라이브러리의 의존성을 줄이기 위해 nodejs의 crypto기능을 활용했어요(라이브러리가 deprecated된 경험이 있어요)

🟦 config

- database
  - prisma를 활용하기위해 nest의 module로 넣는 작업이에요
  - prisma의 query문을 console로 확인하기위해 query가 실행되면 console.log로 확인할 수 있게 했어요.
- filter
  - http의 모든요청을 filtering 해요. 에러를 잡고 응답값을 보기 쉽게 만들어줘요.
  - prisma의 에러를 filtering 해요. validation, request... 에러를 보기 쉽게 만들어주는 곳이에요
- interceptor
  - http의 통신을 logging 하기 위함이에요
- logger
  - winston 라이브러리를 활용해서 logs 폴더에 7일간 로그파일이 존재하게 되요.


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
