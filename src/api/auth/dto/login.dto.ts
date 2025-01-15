import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateLoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'abc@gmail.com',
    description: '이메일',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  password: string;
}
