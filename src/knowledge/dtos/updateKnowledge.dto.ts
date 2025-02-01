import { ApiProperty } from "@nestjs/swagger";
import { IsHexColor, IsOptional, IsString, Matches } from "class-validator";


export class UpdateKnowledgeDTO {
    @ApiProperty({
        example: 'Nome da Área de Conhecimento',
        required: false
    })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({
        example: 'Descrição da Área de Conhecimento',
        required: false
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        example: 1,
        default: 0,
        required: false
    })
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