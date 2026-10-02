import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Cartoon, CartoonDocument } from '../cartoons/schemas/cartoon.schema';
import { Season, SeasonDocument } from '../seasons/schemas/season.schema';
import { Episode, EpisodeDocument } from '../episodes/schemas/episode.schema';
import {
  Voiceover,
  VoiceoverDocument,
} from '../voiceovers/schemas/voiceover.schema';
import { News, NewsDocument } from '../news/schemas/news.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Cartoon.name) private readonly cartoons: Model<CartoonDocument>,
    @InjectModel(Season.name) private readonly seasons: Model<SeasonDocument>,
    @InjectModel(Episode.name) private readonly episodes: Model<EpisodeDocument>,
    @InjectModel(Voiceover.name)
    private readonly voiceovers: Model<VoiceoverDocument>,
    @InjectModel(News.name) private readonly news: Model<NewsDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  nightlyLog(): void {
    this.logger.log('🌙 Nightly cron tick');
  }

  async run(force = false): Promise<void> {
    const count = await this.cartoons.countDocuments();
    if (count > 0 && !force) {
      this.logger.log('ℹ️ DB already seeded, skipping');
      return;
    }

    if (force) {
      await Promise.all([
        this.cartoons.deleteMany({}),
        this.seasons.deleteMany({}),
        this.episodes.deleteMany({}),
        this.voiceovers.deleteMany({}),
        this.news.deleteMany({}),
      ]);
    }

    this.logger.log('🌱 Seeding...');

    const voDocs = await this.voiceovers.insertMany([
      { name: 'Дубляж (RU)', language: 'ru', studio: 'Maple Studio' },
      { name: 'Оригинал', language: 'en', studio: 'Original' },
      { name: 'Многоголосый', language: 'ru', studio: 'FanVoice' },
    ]);
    const voiceIds = voDocs.map((v) => v._id);

    const cartoonTitles = [
      'Кленовый лес',
      'Осенние истории',
      'Красный лист',
      'Лесная стража',
      'Кленовый патруль',
      'Тайна старого клёна',
    ];

    for (let i = 0; i < cartoonTitles.length; i++) {
      const title = cartoonTitles[i];
      const cartoon = await this.cartoons.create({
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        description: `Описание мультсериала «${title}». Приключения, дружба и кленовые листья.`,
        rating: +(7 + Math.random() * 2).toFixed(1),
        posterUrl: `https://picsum.photos/seed/maple${i + 1}/400/560`,
        year: 2021 + (i % 4),
        genres: ['Приключения', 'Фэнтези'],
      });

      for (let s = 1; s <= 3; s++) {
        const season = await this.seasons.create({
          cartoonId: cartoon._id,
          number: s,
          title: `Сезон ${s}`,
        });

        const eps = Array.from({ length: 8 }, (_, e) => ({
          seasonId: season._id,
          cartoonId: cartoon._id,
          number: e + 1,
          title: `Серия ${e + 1}: Кленовое приключение`,
          description: `Описание серии ${e + 1}.`,
          thumbnailUrl: `https://picsum.photos/seed/ep${cartoon._id.toString()}_${s}_${e}/320/180`,
          videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: 22 * 60,
          voiceoverIds: voiceIds,
        }));
        await this.episodes.insertMany(eps);
      }
    }

    await this.news.insertMany(
      Array.from({ length: 4 }, (_, i) => ({
        title: `Новость ${i + 1}: Обновление Maple Leaf`,
        slug: `news-${i + 1}`,
        excerpt: 'Мы добавили новые серии и улучшили плеер.',
        content: 'Полный текст новости про обновления и новые возможности.',
        coverUrl: `https://picsum.photos/seed/news${i}/800/400`,
        publishedAt: new Date(Date.now() - i * 86_400_000),
      })),
    );

    this.logger.log('✅ Seed complete');
  }
}