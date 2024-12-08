import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateStartPointDto } from './dtos/create-start-point.dto';
import { ManageStartPointJourneyDTO } from './dtos/manageStartPointJourney.dto';
import { UpdatePointOrderDto } from './dtos/update-point.dto';
import { PointService } from './point.service';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @ApiBody({
    type: CreateStartPointDto,
  })
  @Post()
  async create(
    @Body() createStartPointDto: CreateStartPointDto,
    @Req() req: Request,
  ) {
    const authHeader = req.headers.authorization as string;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return this.pointService.create(createStartPointDto, token);
  }

  @Get()
  async findAll() {
    return this.pointService.findAll();
  }

  @Get('user/:id')
  async findByUser(@Param('id') userId: string) {
    return this.pointService.findByUserId(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.pointService.findById(id);
  }

  @ApiBody({
    type: CreateStartPointDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStartPointDto: CreateStartPointDto,
  ) {
    return this.pointService.update(id, updateStartPointDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pointService.delete(id);
  }

  @ApiBody({
    type: ManageStartPointJourneyDTO,
  })
  @Patch(':id/add-journey')
  async addJourneyToPoint(
    @Param('id') id: string,
    @Body() body: ManageStartPointJourneyDTO,
  ) {
    return this.pointService.addJourneyToPoint(id, body.journeyId);
  }

  @Get(':pointId/journeys')
  async getJourneysByPointId(@Param('pointId') pointId: string) {
    try {
      return await this.pointService.getJourneysByPointId(pointId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @ApiBody({
    type: UpdatePointOrderDto,
  })
  @Patch('/update-point-order')
  async updatePointOrder(
    @Body()
    pointsDto: UpdatePointOrderDto,
  ) {
    console.log(pointsDto);
    const result = await this.pointService.updateOrder(pointsDto.points);
    return result;
  }
}
