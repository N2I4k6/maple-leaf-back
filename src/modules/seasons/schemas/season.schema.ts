import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SeasonDocument = HydratedDocument<Season>;

@Schema({ timestamps: true, collection: 'seasons' })
export class Season {
  @ApiProperty()
  _id!: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Cartoon', index: true })
  cartoonId!: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, min: 1 })
  number!: number;

  @ApiProperty()
  @Prop({ required: true })
  title!: string;

  @ApiProperty()
  @Prop({ default: '' })
  description!: string;

  @ApiProperty()
  @Prop({ default: '' })
  posterUrl!: string;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);

SeasonSchema.index({ cartoonId: 1, number: 1 }, { unique: true });