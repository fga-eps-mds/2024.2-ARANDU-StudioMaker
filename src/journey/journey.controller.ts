import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { ManageJourneyTrailDTO } from './dtos/manageJourneyTrail.dto';
import { UpdateJourneysOrderDto } from './dtos/updateJourneyOrder';
import { JourneyService } from './journey.service';

@Controller('journeys')
export class JourneyController {
  private readonly logger = new Logger(JourneyController.name);
  constructor(private readonly journeyService: JourneyService) {}

  @ApiBody({
    type: CreateJourneyDto,
    description: 'Estrutura para criação de jornadas',
  })
  @Post()
  async create(@Body() body: CreateJourneyDto) {
    const pointId = body.pointId;

    if (!pointId) {
      throw new NotFoundException('Point ID not provided in body');
    }

    return this.journeyService.create(body, pointId);
  }
  @Get()
  async findAll() {
    return this.journeyService.findAll();
  }

  @Get('point/:id')
  async findByPointId(@Param('id') pointId: string) {
    return this.journeyService.findByPointId(pointId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.journeyService.findById(id);
  }

  @ApiBody({
    type: CreateJourneyDto,
    description: 'Estrutura para edição de jornadas',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJourneyDto: CreateJourneyDto,
  ) {
    return this.journeyService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.journeyService.delete(id);
  }

  @ApiBody({
    type: ManageJourneyTrailDTO
  })
  @Patch(':id/add-trail')
  async addTrailToJourney(
    @Param('id') id: string,
    @Body() body: ManageJourneyTrailDTO,
  ) {
    return this.journeyService.addTrailToJourney(id, body.trailId);
  }

  @ApiBody({
    type: UpdateJourneysOrderDto
  })
  @Patch('update-journeys-order')
  async updateTrailOrder(@Body() journeysDto: UpdateJourneysOrderDto) {
    this.logger.log(
      `Updating trail order for the list: ${JSON.stringify(journeysDto.journeys)}`,
    );
    const result = await this.journeyService.updateOrder(journeysDto.journeys);
    return result;
  }
}
