import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId } from 'mongoose';

import { CityDocument } from '../cities/schemas/city.schema';
import { Forecast, ForecastDocument } from './schemas/forecast.schema';
import { normalizeForecastData } from './utils/forecast.utils';

interface IForecast {
  city: {
    name: string;
    country: string;
  };
  list: [
    {
      main: {
        temp_min: number;
      };
      dt_txt: string;
    },
  ];
}

@Injectable()
export class ForecastService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel(Forecast.name) private forecastModel: Model<ForecastDocument>,
  ) {}

  private readonly url = this.configService.get<string>('forecastAPI.url');
  private readonly key = this.configService.get<string>('forecastAPI.key');

  async fetchForecast({ name, country }: CityDocument) {
    try {
      const { data } = await this.httpService
        .get<IForecast>(this.url, {
          params: {
            units: 'metric',
            q: `${name},${country}`,
            appid: this.key,
          },
        })
        .toPromise();

      return normalizeForecastData(data);
    } catch (error) {
      return [];
    }
  }

  updateForecast(
    forecast: Pick<Forecast, 'date' | 'minTemp'>[],
    city: CityDocument,
  ) {
    return Promise.all(
      forecast.map(({ date, minTemp }) =>
        this.forecastModel
          .findOneAndUpdate(
            {
              date,
              city,
            },
            { minTemp },
            { upsert: true },
          )
          .exec(),
      ),
    );
  }

  async findByCityId(id: string | ObjectId): Promise<ForecastDocument[]> {
    if (!isValidObjectId(id)) return [];

    return this.forecastModel
      .where({ city: id })
      .sort({ date: 1 })
      .populate('city')
      .exec();
  }
}
