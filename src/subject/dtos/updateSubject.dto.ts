import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class UpdateSubjectDTO {
    @ApiProperty({
        example: 'Nome da Disciplina',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Nome Disc.',
        required: false,
        maxLength: 10
    })
    @IsString()
    @IsOptional()
    shortName?: string = 'default';

    @ApiProperty({
        example: 'Descrição da Disciplina',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: '1',
        required: false
    })
    order?: Number;
}