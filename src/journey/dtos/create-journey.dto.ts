import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateJourneyDto {
  @ApiProperty({
    example: 'Título',
    required: true
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Descrição',
    required: false
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'id-do-point',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  pointId?: string;
}
