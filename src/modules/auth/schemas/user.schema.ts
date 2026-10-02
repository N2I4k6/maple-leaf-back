import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @ApiProperty()
  @Prop({ required: true })
  passwordHash!: string;

  @ApiProperty()
  @Prop({ required: true })
  name!: string;

  @ApiProperty({ enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);