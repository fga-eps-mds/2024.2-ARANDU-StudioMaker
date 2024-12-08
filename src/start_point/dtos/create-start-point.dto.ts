import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateStartPointDto {
  @ApiProperty({
    example: 'Nome',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descrição',
    required: true
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'id-do-user',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  user?: string;

  @ApiProperty({
    example: '1',
    required: false
  })
  order?: Number;
}
