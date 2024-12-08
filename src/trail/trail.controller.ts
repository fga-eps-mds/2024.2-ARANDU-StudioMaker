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
import { UpdateTrailsDtos } from 'src/trail/dtos/updateTrailsDtos';
import { CreateTrailDto } from './dtos/createTrail.dto';
import { ManageTrailContentDTO } from './dtos/manageTrailContent.dto';
import { TrailService } from './trail.service';

@Controller('trails')
export class TrailController {
  constructor(private readonly trailService: TrailService) {}
  private readonly logger = new Logger(TrailController.name);

  @ApiBody({
    type: CreateTrailDto,
    description: 'Estrutura para criação de trilhas',
  })
  @Post()
  async createTrail(@Body() body: CreateTrailDto) {
    const { name, journeyId } = body;

    if (!journeyId) {
      throw new NotFoundException('Journey ID not provided in body');
    }

    return this.trailService.createTrail(name, journeyId);
  }

  @Get(':id')
  async getTrailById(@Param('id') id: string) {
    return this.trailService.findTrailById(id);
  }

  @Get()
  async getAllTrails() {
    return this.trailService.findAllTrails();
  }

  @Get('journey/:id')
  async getTrailsByJourneyId(@Param('id') id: string) {
    return this.trailService.findTrailsByJourneyId(id);
  }

  @Put(':id')
  async updateTrail(
    @Param('id') id: string,
    @Body() updateData: Partial<{ name: string; description?: string }>,
  ) {
    return this.trailService.updateTrail(id, updateData);
  }

  @ApiBody({
    type: ManageTrailContentDTO,
    description: 'Estrutura para adição de conteúdos às trilhas',
  })
  @Put(':id/addContent')
  async addContentToTrail(
    @Param('id') trailId: string,
    @Body() body: ManageTrailContentDTO,
  ) {
    const { contentId } = body;
    if (!contentId) {
      throw new NotFoundException('Content ID not provided in body');
    }
    return this.trailService.addContentToTrail(trailId, contentId);
  }

  @ApiBody({
    type: ManageTrailContentDTO,
    description: 'Estrutura para remoção de conteúdos das trilhas',
  })
  @Put(':id/removeContent')
  async removeContentFromTrail(
    @Param('id') trailId: string,
    @Body() body: ManageTrailContentDTO,
  ) {
    const { contentId } = body;
    return this.trailService.removeContentFromTrail(trailId, contentId);
  }

  @Delete(':id')
  async deleteTrail(@Param('id') id: string) {
    await this.trailService.deleteTrail(id);
    return { message: 'Trail deleted successfully' };
  }

  @ApiBody({
    type: UpdateTrailsDtos,
  })
  @Patch('update-trail-order')
  async updateTrailOrder(@Body() trailsDto: UpdateTrailsDtos) {
    this.logger.log(
      `Updating trail order for the list: ${JSON.stringify(trailsDto.trails)}`,
    );
    const result = await this.trailService.updateTrailOrder(trailsDto.trails);
    return result;
  }
}
