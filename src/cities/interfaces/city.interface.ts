import { ObjectId } from 'mongoose';

interface Forecast {
  date: Date;
  isLowExceeded: boolean;
  minTemp: number;
  updatedAt?: Date;
}

export interface City {
  id: ObjectId;
  name: string;
  country: string;
  lowTempLimit: number;
  forecast: Forecast[];
}
