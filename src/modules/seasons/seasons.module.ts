import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Season, SeasonSchema } from './schemas/season.schema';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Season.name, schema: SeasonSchema }])],
  controllers: [SeasonsController],
  providers: [SeasonsService],
  exports: [SeasonsService, MongooseModule],
})
export class SeasonsModule {}