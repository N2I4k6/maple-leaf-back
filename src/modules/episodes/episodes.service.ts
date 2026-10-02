import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Episode, EpisodeDocument } from './schemas/episode.schema';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectModel(Episode.name) private readonly model: Model<EpisodeDocument>,
  ) {}

  async create(dto: CreateEpisodeDto): Promise<EpisodeDocument> {
    const seasonId = new Types.ObjectId(dto.seasonId);
    const cartoonId = new Types.ObjectId(dto.cartoonId);

    const exists = await this.model.exists({ seasonId, number: dto.number });
    if (exists) {
      throw new ConflictException(
        `Серия №${dto.number} уже существует в этом сезоне`,
      );
    }

    const doc = await this.model.create({
      ...dto,
      seasonId,
      cartoonId,
      voiceoverIds: (dto.voiceoverIds ?? []).map(
        (id) => new Types.ObjectId(id),
      ),
    });
    return doc.populate('voiceoverIds');
  }

  async findBySeason(seasonId: Types.ObjectId): Promise<EpisodeDocument[]> {
    return this.model
      .find({ seasonId })
      .populate('voiceoverIds')
      .sort({ number: 1 })
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<EpisodeDocument> {
    const doc = await this.model.findById(id).populate('voiceoverIds').exec();
    if (!doc) throw new NotFoundException('Episode not found');
    return doc;
  }

  async update(
    id: Types.ObjectId,
    dto: UpdateEpisodeDto,
  ): Promise<EpisodeDocument> {
    const current = await this.model.findById(id).exec();
    if (!current) throw new NotFoundException('Episode not found');

    const nextNumber = dto.number ?? current.number;
    const nextSeasonId = dto.seasonId
      ? new Types.ObjectId(dto.seasonId)
      : current.seasonId;

    const numberChanged = nextNumber !== current.number;
    const seasonChanged = !nextSeasonId.equals(current.seasonId);

    if (numberChanged || seasonChanged) {
      const conflict = await this.model.exists({
        _id: { $ne: id },
        seasonId: nextSeasonId,
        number: nextNumber,
      });
      if (conflict) {
        throw new ConflictException(
          `Серия №${nextNumber} уже существует в этом сезоне`,
        );
      }
    }

    const update: Record<string, unknown> = { ...dto };
    if (dto.seasonId) update.seasonId = nextSeasonId;
    if (dto.cartoonId) update.cartoonId = new Types.ObjectId(dto.cartoonId);
    if (dto.voiceoverIds) {
      update.voiceoverIds = dto.voiceoverIds.map(
        (vid) => new Types.ObjectId(vid),
      );
    }

    const doc = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .populate('voiceoverIds')
      .exec();
    if (!doc) throw new NotFoundException('Episode not found');
    return doc;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Episode not found');
  }
}