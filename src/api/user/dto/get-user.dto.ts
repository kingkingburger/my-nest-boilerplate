import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetUserListDto {
  @ApiPropertyOptional({
    description: '페이지의 시작 위치(오프셋)',
    example: '0',
  })
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @ApiPropertyOptional({
    description: '가져올 개수(리밋)',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  take?: string;

  @ApiPropertyOptional({
    description: 'Sequelize where 조건(JSON 문자열)',
    example: '{"name":"John"}',
  })
  @IsOptional()
  @IsString()
  where?: string;

  @ApiPropertyOptional({
    description: 'Sequelize orderBy 조건(JSON 문자열)',
    example: '[["id","DESC"]]',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;
}
