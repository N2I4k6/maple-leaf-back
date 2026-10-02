import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { MongoIdPipe } from '@/common/pipes/mongo-id.pipe';

@ApiTags('news')
@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryNewsDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateNewsDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', MongoIdPipe) id: Types.ObjectId, @Body() dto: UpdateNewsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.remove(id);
  }
}