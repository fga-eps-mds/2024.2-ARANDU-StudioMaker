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
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Content } from './content.schema';
import { ContentService } from './content.service';
import { CreateContentDto } from './dtos/create-content.dto';
import { UpdateContentsOrderDto } from './dtos/update-content-order.dto';
import { UpdateContentDto } from './dtos/update-content.dto';

@Controller('contents')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);
  constructor(private readonly contentService: ContentService) {}

  @ApiBody({
    type: CreateContentDto,
    description: 'Estrutura para criação de conteúdo',
  })
  @Post()
  async createContent(
    @Body() body: { title: string; content: string; trailId: string },
  ): Promise<Content> {
    const { title, content, trailId } = body;

    if (!title || !content || !trailId) {
      throw new NotFoundException('Title, content, and trailId are required');
    }

    return this.contentService.createContent(title, content, trailId);
  }

  @Get(':id')
  async findContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findContentById(id);
  }

  @Get()
  async findAllContents(): Promise<Content[]> {
    return this.contentService.findAllContents();
  }

  @Get('trail/:id')
  async findContentsByTrailId(@Param('id') id: string): Promise<Content[]> {
    return this.contentService.findContentsByTrailId(id);
  }

  @ApiBody({
    type: UpdateContentDto,
    description: 'Estrutura para edição de conteúdo',
  })
  @Patch(':id')
  async updateContent(
    @Param('id') id: string,
    @Body() updateData: Partial<Content>,
  ): Promise<Content> {
    return this.contentService.updateContent(id, updateData);
  }

  @Delete(':id')
  async deleteContent(@Param('id') id: string): Promise<void> {
    return this.contentService.deleteContent(id);
  }

  @ApiBody({
    type: UpdateContentsOrderDto,
    description: 'Estrutura para edição da ordem do conteúdo',
  })
  @Patch('order/update-order')
  async updateTrailOrder(@Body() contentsDto: UpdateContentsOrderDto) {
    this.logger.log(
      `Updating trail order for the list: ${JSON.stringify(contentsDto.contents)}`,
    );
    const result = await this.contentService.updateContentOrder(
      contentsDto.contents,
    );
    return result;
  }
}
