import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartoonDocument = HydratedDocument<Cartoon>;

@Schema({ timestamps: true, collection: 'cartoons' })
export class Cartoon {
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
  description!: string;

  @ApiProperty()
  @Prop({ required: true, min: 0, max: 10, default: 0 })
  rating!: number;

  @ApiProperty()
  @Prop({ required: true })
  posterUrl!: string;

  @ApiProperty()
  @Prop({ required: true })
  year!: number;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  genres!: string[];

  @ApiProperty()
  @Prop({ default: true })
  isPublished!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export const CartoonSchema = SchemaFactory.createForClass(Cartoon);

CartoonSchema.index({ title: 'text', description: 'text' });