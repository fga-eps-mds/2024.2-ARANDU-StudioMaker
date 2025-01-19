import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, UnauthorizedException } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { Request } from 'express';
import { CreateSubjectDTO } from "./dtos/createSubject.dto";
import { UpdateSubjectDTO } from "./dtos/updateSubject.dto";
import { UpdateSubjectOrderDto } from "./dtos/updateSubjectOrder.dto";
import { SubjectService } from "./subject.service";


@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @ApiBody({
        type: CreateSubjectDTO,
        description: 'Endpoint para a criação de uma nova Disciplina'
    })
    @Post()
    async create(
        @Body() createSubjectDTO: CreateSubjectDTO,
        @Req() req: Request
    ) {
        const authHeader = req.headers.authorization as string;
        const token = authHeader?.split(' ')[1];

        if (!token) throw new UnauthorizedException(`Token not found!`);

        return this.subjectService.create(createSubjectDTO, token);
    }

    @Get()
    async findAll() {
        return this.subjectService.findAll();
    }

    @Get('users/:id')
    async findByUser(@Param('id') userId: string) {
        return this.subjectService.findByUserId(userId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.subjectService.findById(id);
    }

    @ApiBody({
        type: UpdateSubjectDTO,
        description: 'Endpoint para a atualização total ou parcial de uma Disciplina'
    })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSubjectDTO: UpdateSubjectDTO,
    ) {
        return this.subjectService.update(id, updateSubjectDTO);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.subjectService.delete(id);
    }

    @Put(':id/journeys/:journeyId')
    async addJourneyToSubject(
        @Param('id') id: string,
        @Param('journeyId') journeyId: string
    ) {
        return this.subjectService.addJourneyToSubject(id, journeyId);
    }

    @Get(':id/journeys')
    async getJourneysBySubjectId(@Param('id') subjectId: string) {
        try {
            return await this.subjectService.getJourneysBySubjectId(subjectId);
        } catch (error) {
            if (error instanceof NotFoundException) throw new NotFoundException(error.message);
            
            throw error;
        }
    }

    @ApiBody({
        type: UpdateSubjectOrderDto,
    })
    @Patch('/order')
    async updatePointOrder(
        @Body()
        body: UpdateSubjectOrderDto,
    ) {
        return await this.subjectService.updateOrder(body.subjects);
    }

}