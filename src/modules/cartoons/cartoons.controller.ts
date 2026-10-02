import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

import { CartoonsService } from './cartoons.service';
import { CreateCartoonDto } from './dto/create-cartoon.dto';
import { UpdateCartoonDto } from './dto/update-cartoon.dto';
import { QueryCartoonDto } from './dto/query-cartoon.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { MongoIdPipe } from '@/common/pipes/mongo-id.pipe';

@ApiTags('cartoons')
@Controller('cartoons')
@UseGuards(JwtAuthGuard)
export class CartoonsController {
  constructor(private readonly service: CartoonsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Список мультсериалов' })
  findAll(@Query() query: QueryCartoonDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Мультсериал по slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Мультсериал по id' })
  findById(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать мультсериал (админ)' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateCartoonDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', MongoIdPipe) id: Types.ObjectId, @Body() dto: UpdateCartoonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.remove(id);
  }
}