import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string): Types.ObjectId {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ObjectId: ${value}`);
    }
    return new Types.ObjectId(value);
  }
}