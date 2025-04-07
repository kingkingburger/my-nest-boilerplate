import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteUserDto {
  @ApiProperty({
    description: '사용자 id 목록',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];
}
