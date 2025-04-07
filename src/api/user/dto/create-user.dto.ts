import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto implements Prisma.userCreateInput {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'abc@gmail.com',
    description: '이메일 주소',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  password: string;

  @ApiProperty({
    example: 'min',
    description: '이름',
    nullable: true,
    required: false,
  })
  name?: string | null;

  @IsOptional()
  deletedAt: Date | string;
}
