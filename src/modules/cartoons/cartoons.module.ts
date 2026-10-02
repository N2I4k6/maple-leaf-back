import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cartoon, CartoonSchema } from './schemas/cartoon.schema';
import { CartoonsService } from './cartoons.service';
import { CartoonsController } from './cartoons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cartoon.name, schema: CartoonSchema }]),
  ],
  controllers: [CartoonsController],
  providers: [CartoonsService],
  exports: [CartoonsService, MongooseModule],
})
export class CartoonsModule {}