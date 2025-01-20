import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateSubjectDTO {
    @ApiProperty({
        example: 'Nome da Disciplina',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Nome Disc.',
        required: false,
        maxLength: 10
    })
    @IsString()
    @IsOptional()
    shortName: string = 'default';

    @ApiProperty({
        example: 'Descrição da Disciplina',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsMongoId()
    user?: string;

    @ApiProperty({
        example: '1',
        required: false
    })
    order?: Number;
}