import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateContentDto {
  @ApiProperty({
    example: 'Título',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Conteúdo',
    required: false
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 'id-da-trilha',
    required: false
  })
  @IsMongoId()
  @IsOptional()
  trailId?: string;
}
