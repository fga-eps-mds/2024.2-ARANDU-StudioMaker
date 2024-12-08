import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrailDto {
  @ApiProperty({
    example: 'Nome da Trilha',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'id-da-jornada',
    required: true
  })
  @IsMongoId()
  @IsNotEmpty()
  journeyId: string;
}
