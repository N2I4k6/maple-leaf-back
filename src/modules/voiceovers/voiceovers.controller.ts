import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { VoiceoversService } from './voiceovers.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { MongoIdPipe } from '@/common/pipes/mongo-id.pipe';

@ApiTags('voiceovers')
@Controller('voiceovers')
@UseGuards(JwtAuthGuard)
export class VoiceoversController {
  constructor(private readonly service: VoiceoversService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() body: { name: string; language: string; studio?: string }) {
    return this.service.create(body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return this.service.remove(id);
  }
}