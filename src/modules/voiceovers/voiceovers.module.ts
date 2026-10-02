import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voiceover, VoiceoverSchema } from './schemas/voiceover.schema';
import { VoiceoversService } from './voiceovers.service';
import { VoiceoversController } from './voiceovers.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Voiceover.name, schema: VoiceoverSchema }])],
  controllers: [VoiceoversController],
  providers: [VoiceoversService],
  exports: [VoiceoversService, MongooseModule],
})
export class VoiceoversModule {}