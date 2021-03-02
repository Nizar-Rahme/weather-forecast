import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type CityDocument = City & Document<ObjectId>;

@Schema()
export class City {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  country: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ name: 1, country: 1 }, { unique: true });
