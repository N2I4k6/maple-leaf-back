import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EpisodeDocument = HydratedDocument<Episode>;

@Schema({ timestamps: true, collection: 'episodes' })
export class Episode {
  @ApiProperty()
  _id!: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Season', index: true })
  seasonId!: Types.ObjectId;

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
  @Prop({ required: true })
  thumbnailUrl!: string;

  @ApiProperty()
  @Prop({ required: true })
  videoUrl!: string;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  duration!: number;

  @ApiProperty()
  @Prop({ default: true })
  isPublished!: boolean;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: 'Voiceover', default: [] })
  voiceoverIds!: Types.ObjectId[];
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);

EpisodeSchema.index({ seasonId: 1, number: 1 }, { unique: true });