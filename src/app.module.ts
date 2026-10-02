import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';

import { AuthModule } from './modules/auth/auth.module';
import { CartoonsModule } from './modules/cartoons/cartoons.module';
import { SeasonsModule } from './modules/seasons/seasons.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { VoiceoversModule } from './modules/voiceovers/voiceovers.module';
import { NewsModule } from './modules/news/news.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'), 
      }),
    }),

    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    ScheduleModule.forRoot(),

    AuthModule,
    CartoonsModule,
    SeasonsModule,
    EpisodesModule,
    VoiceoversModule,
    NewsModule,
    UploadsModule,
    SeedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}