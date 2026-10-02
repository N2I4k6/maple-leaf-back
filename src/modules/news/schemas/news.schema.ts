import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true, collection: 'news' })
export class News {
  @ApiProperty()
  _id!: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, trim: true })
  title!: string;

  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, index: true })
  slug!: string;

  @ApiProperty()
  @Prop({ required: true })
  excerpt!: string;

  @ApiProperty()
  @Prop({ required: true })
  content!: string;

  @ApiProperty()
  @Prop({ required: true })
  coverUrl!: string;

  @ApiProperty()
  @Prop({ default: true })
  isPublished!: boolean;

  @ApiProperty()
  publishedAt!: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);