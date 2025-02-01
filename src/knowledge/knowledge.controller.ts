import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UnauthorizedException } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { Request } from "express";
import { CreateKnowledgeDTO } from "./dtos/createKnowledge.dto";
import { UpdateKnowledgeDTO } from "./dtos/updateKnowledge.dto";
import { UpdateKnowledgeOrderDTO } from "./dtos/updateKnowledgeOrder.dto";
import { KnowledgeService } from "./knowledge.service";


@Controller('knowledges')
export class KnowledgeController {
    constructor(private readonly knowledgeService: KnowledgeService) { }

    @ApiBody({
        type: CreateKnowledgeDTO,
        description: 'Endpoint para a criação de uma nova Área de Conhecimento'
    })
    @Post()
    async create(
        @Body() createKnowledgeDTO: CreateKnowledgeDTO,
        @Req() req: Request
    ) {
        const authHeader = req.headers.authorization as string;
        const token = authHeader?.split(' ')[1];

        if (!token) throw new UnauthorizedException(`Token not found!`);

        return this.knowledgeService.create(createKnowledgeDTO, token);
    }

    @Get()
    async getAllKnowledge() {
        return this.knowledgeService.getAllKnowledge();
    }

    @Get('users/:id')
    async getByUser(@Param('id') userId: string) {
        return this.knowledgeService.getByUserId(userId);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.knowledgeService.getById(id);
    }

    @ApiBody({
        type: UpdateKnowledgeDTO,
        description: 'Endpoint para a atualização total ou parcial de uma Área de Conhecimento'
    })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateKnowledgeDTO: UpdateKnowledgeDTO,
    ) {
        return this.knowledgeService.update(id, updateKnowledgeDTO);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.knowledgeService.delete(id);
    }

    @Put(':id/subjects/:subjectId')
    async addSubjectToKnowledge(
        @Param('id') id: string,
        @Param('subjectId') subjectId: string
    ) {
        return this.knowledgeService.addSubjectToKnowledge(id, subjectId);
    }

    @Get(':id/subjects')
    async getSubjectsByKnowledgeId(@Param('id') knowledgeId: string) {
        try {
            return await this.knowledgeService.getSubjectsByKnowledgeId(knowledgeId);
        } catch (error) {

            throw error;
        }
    }

    @ApiBody({
        type: UpdateKnowledgeOrderDTO,
    })
    @Patch('/order')
    async updateKnowledgeOrder(
        @Body()
        body: UpdateKnowledgeOrderDTO,
    ) {
        return await this.knowledgeService.updateOrder(body.knowledge);
    }
}