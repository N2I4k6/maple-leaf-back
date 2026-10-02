import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';

import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly model: Model<NewsDocument>,
  ) {}

  private makeSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'ru' });
  }

  async create(dto: CreateNewsDto): Promise<NewsDocument> {
    const slug = this.makeSlug(dto.title);
    if (await this.model.exists({ slug })) {
      throw new ConflictException('News with this title already exists');
    }
    return this.model.create({ ...dto, slug, publishedAt: new Date() });
  }

  async findAll(query: QueryNewsDto): Promise<PaginatedResponseDto<NewsDocument>> {
    const [items, total] = await Promise.all([
      this.model
        .find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .skip(query.skip)
        .limit(query.limit)
        .exec(),
      this.model.countDocuments({ isPublished: true }),
    ]);
    return PaginatedResponseDto.create(items, total, query.page, query.limit);
  }

  async findBySlug(slug: string): Promise<NewsDocument> {
    const doc = await this.model.findOne({ slug }).exec();
    if (!doc) throw new NotFoundException('News not found');
    return doc;
  }

  async update(id: Types.ObjectId, dto: UpdateNewsDto): Promise<NewsDocument> {
    const update: Record<string, unknown> = { ...dto };
    if (dto.title) update.slug = this.makeSlug(dto.title);
    const doc = await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!doc) throw new NotFoundException('News not found');
    return doc;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('News not found');
  }
}