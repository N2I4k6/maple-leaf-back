import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { SeasonsService } from './seasons.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { MongoIdPipe } from '@/common/pipes/mongo-id.pipe';

@ApiTags('seasons')
@Controller('seasons')
@UseGuards(JwtAuthGuard)
export class SeasonsController {
  constructor(private readonly service: SeasonsService) {}

  @Public()
  @Get('by-cartoon/:cartoonId')
  @ApiOperation({ summary: 'Сезоны мультсериала' })
  byCartoon(@Param('cartoonId', MongoIdPipe) cartoonId: Types.ObjectId) {
    return this.service.findByCartoon(cartoonId);
  }

  @Public()
  @Get(':id')
  findById(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateSeasonDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', MongoIdPipe) id: Types.ObjectId, @Body() dto: UpdateSeasonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.remove(id);
  }
}