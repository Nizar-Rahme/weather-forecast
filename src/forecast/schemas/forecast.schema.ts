import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document, ObjectId } from 'mongoose';

import { CityDocument } from '../../cities/schemas/city.schema';

export type ForecastDocument = Forecast & Document<ObjectId>;

@Schema({ timestamps: true })
export class Forecast {
  @Prop({ required: true })
  minTemp: number;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'City',
    required: true,
    index: true,
  })
  city: CityDocument;
}

export const ForecastSchema = SchemaFactory.createForClass(Forecast);
