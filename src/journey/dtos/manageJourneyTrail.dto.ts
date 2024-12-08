import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ManageJourneyTrailDTO {
  @ApiProperty({
    example: 'id-da-trilha',
    required: true
  })
  @IsMongoId()
  @IsNotEmpty()
  trailId: string;
}
