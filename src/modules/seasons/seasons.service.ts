import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Season, SeasonDocument } from './schemas/season.schema';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Injectable()
export class SeasonsService {
  constructor(
    @InjectModel(Season.name) private readonly model: Model<SeasonDocument>,
  ) {}

  async create(dto: CreateSeasonDto): Promise<SeasonDocument> {
    const cartoonId = new Types.ObjectId(dto.cartoonId);

    const exists = await this.model.exists({
      cartoonId,
      number: dto.number,
    });
    if (exists) {
      throw new ConflictException(
        `Сезон №${dto.number} уже существует у этого сериала`,
      );
    }

    return this.model.create({
      ...dto,
      cartoonId,
    });
  }

  async findByCartoon(cartoonId: Types.ObjectId): Promise<SeasonDocument[]> {
    return this.model.find({ cartoonId }).sort({ number: 1 }).exec();
  }

  async findById(id: Types.ObjectId): Promise<SeasonDocument> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Season not found');
    return doc;
  }

  async update(id: Types.ObjectId, dto: UpdateSeasonDto): Promise<SeasonDocument> {
    const current = await this.model.findById(id).exec();
    if (!current) throw new NotFoundException('Season not found');

    const nextNumber = dto.number ?? current.number;
    const nextCartoonId = dto.cartoonId
      ? new Types.ObjectId(dto.cartoonId)
      : current.cartoonId;

    const numberChanged = nextNumber !== current.number;
    const cartoonChanged = !nextCartoonId.equals(current.cartoonId);

    if (numberChanged || cartoonChanged) {
      const conflict = await this.model.exists({
        _id: { $ne: id },
        cartoonId: nextCartoonId,
        number: nextNumber,
      });
      if (conflict) {
        throw new ConflictException(
          `Сезон №${nextNumber} уже существует у этого сериала`,
        );
      }
    }

    const update: Record<string, unknown> = { ...dto };
    if (dto.cartoonId) update.cartoonId = nextCartoonId;

    const doc = await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!doc) throw new NotFoundException('Season not found');
    return doc;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Season not found');
  }
}