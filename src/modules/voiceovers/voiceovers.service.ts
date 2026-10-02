import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Voiceover, VoiceoverDocument } from './schemas/voiceover.schema';

@Injectable()
export class VoiceoversService {
  constructor(
    @InjectModel(Voiceover.name) private readonly model: Model<VoiceoverDocument>,
  ) {}

  findAll(): Promise<VoiceoverDocument[]> {
    return this.model.find().sort({ name: 1 }).exec();
  }

  create(data: Partial<Voiceover>): Promise<VoiceoverDocument> {
    return this.model.create(data);
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Voiceover not found');
  }
}