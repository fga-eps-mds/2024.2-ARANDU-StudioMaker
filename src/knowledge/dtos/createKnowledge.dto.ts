import { ApiProperty } from "@nestjs/swagger";
import { IsHexColor, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";


export class CreateKnowledgeDTO {
    @ApiProperty({
        example: 'Nome da Área de Conhecimento',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Descrição da Área de Conhecimento',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsMongoId()
    user?: string;

    @ApiProperty({
        example: 0,
        default: 0,
        required: false
    })
    @IsOptional()
    order?: Number;

    @ApiProperty({
        example: '#E0E0E0',
        default: '#E0E0E0'
    })
    @IsString()
    @IsHexColor()
    @Matches("^#([0-9a-fA-F]{3}){1,2}$")
    @IsOptional()
    color?: string = '#E0E0E0';
}