import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ManageTrailContentDTO {
  @ApiProperty({
    example: 'id-do-conteudo',
    required: true
  })
  @IsMongoId()
  @IsNotEmpty()
  contentId: string;
}
