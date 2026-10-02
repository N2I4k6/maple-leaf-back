import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VoiceoverDocument = HydratedDocument<Voiceover>;

@Schema({ timestamps: true, collection: 'voiceovers' })
export class Voiceover {
  @ApiProperty()
  _id!: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, unique: true, trim: true })
  name!: string;

  @ApiProperty()
  @Prop({ required: true, lowercase: true })
  language!: string;

  @ApiProperty()
  @Prop({ default: '' })
  studio!: string;
}

export const VoiceoverSchema = SchemaFactory.createForClass(Voiceover);