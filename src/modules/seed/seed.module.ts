import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CartoonsModule } from '../cartoons/cartoons.module';
import { SeasonsModule } from '../seasons/seasons.module';
import { EpisodesModule } from '../episodes/episodes.module';
import { VoiceoversModule } from '../voiceovers/voiceovers.module';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [CartoonsModule, SeasonsModule, EpisodesModule, VoiceoversModule, NewsModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}