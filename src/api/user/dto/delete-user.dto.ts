import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: '[1,2]',
    description: 'user의 id들',
  })
  ids: number[];
}
