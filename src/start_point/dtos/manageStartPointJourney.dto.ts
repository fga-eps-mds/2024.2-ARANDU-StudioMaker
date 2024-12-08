import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ManageStartPointJourneyDTO {
  @ApiProperty({
    example: 'id-da-jornada',
    required: true
  })
  @IsMongoId()
  @IsNotEmpty()
  journeyId: string;
}
