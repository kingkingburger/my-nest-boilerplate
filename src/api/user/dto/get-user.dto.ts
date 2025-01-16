import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserListDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of records to skip',
  })
  skip?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of records to take',
  })
  take?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter conditions as JSON string',
    example: '{"name": {"contains": "John"}}',
  })
  where?: string; // Prisma.userWhereInput 대신 문자열로 받음

  @ApiPropertyOptional({
    type: String,
    description: 'Order conditions as JSON string',
    example: '{"createdAt": "desc"}',
  })
  orderBy?: string; // Prisma.userOrderByWithRelationInput 대신 문자열로 받음
}
