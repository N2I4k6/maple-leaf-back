import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type FilterQuery } from 'mongoose';
import slugify from 'slugify';

import { Cartoon, CartoonDocument } from './schemas/cartoon.schema';
import { CreateCartoonDto } from './dto/create-cartoon.dto';
import { UpdateCartoonDto } from './dto/update-cartoon.dto';
import { QueryCartoonDto } from './dto/query-cartoon.dto';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

@Injectable()
export class CartoonsService {
  constructor(
    @InjectModel(Cartoon.name) private readonly model: Model<CartoonDocument>,
  ) {}

  private makeSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'ru' });
  }

  async create(dto: CreateCartoonDto): Promise<CartoonDocument> {
    const slug = this.makeSlug(dto.title);
    const exists = await this.model.exists({ slug });
    if (exists) {
      throw new ConflictException('Cartoon with this title already exists');
    }

    return this.model.create({ ...dto, slug });
  }

  async findAll(
    query: QueryCartoonDto,
  ): Promise<PaginatedResponseDto<CartoonDocument>> {
    const filter: FilterQuery<CartoonDocument> = {};

    if (query.search) filter.$text = { $search: query.search };
    if (query.genre) filter.genres = query.genre;
    if (query.year) filter.year = Number(query.year);

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.skip)
        .limit(query.limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return PaginatedResponseDto.create(items, total, query.page, query.limit);
  }

  async findById(id: Types.ObjectId): Promise<CartoonDocument> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Cartoon not found');
    return doc;
  }

  async findBySlug(slug: string): Promise<CartoonDocument> {
    const doc = await this.model.findOne({ slug }).exec();
    if (!doc) throw new NotFoundException('Cartoon not found');
    return doc;
  }

  async update(
    id: Types.ObjectId,
    dto: UpdateCartoonDto,
  ): Promise<CartoonDocument> {
    const update: Record<string, unknown> = { ...dto };
    if (dto.title) update.slug = this.makeSlug(dto.title);

    const doc = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Cartoon not found');
    return doc;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Cartoon not found');
  }
}