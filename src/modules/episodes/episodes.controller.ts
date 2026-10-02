import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { MongoIdPipe } from '@/common/pipes/mongo-id.pipe';

@ApiTags('episodes')
@Controller('episodes')
@UseGuards(JwtAuthGuard)
export class EpisodesController {
  constructor(private readonly service: EpisodesService) {}

  @Public()
  @Get('by-season/:seasonId')
  @ApiOperation({ summary: 'Серии сезона' })
  bySeason(@Param('seasonId', MongoIdPipe) seasonId: Types.ObjectId) {
    return this.service.findBySeason(seasonId);
  }

  @Public()
  @Get(':id')
  findById(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateEpisodeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', MongoIdPipe) id: Types.ObjectId, @Body() dto: UpdateEpisodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.remove(id);
  }
}