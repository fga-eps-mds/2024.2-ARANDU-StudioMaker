import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    example: 'Título',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Conteúdo',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'id-da-trilha',
    required: true
  })
  @IsMongoId()
  @IsNotEmpty()
  trailId: string;
}
