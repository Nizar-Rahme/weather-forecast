import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, ObjectId } from 'mongoose';
import { Cache } from 'cache-manager';

import { ForecastService } from '../forecast/forecast.service';
import { City, CityDocument } from './schemas/city.schema';
import { CreateCityDto } from './dto/create-city.dto';
import { SchedulerService } from '../scheduler/scheduler.service';

interface Weather {
  date: Date;
  isLowExceeded: boolean;
  minTemp: number;
  updatedAt?: Date;
}

interface ICity {
  id: ObjectId;
  name: string;
  country: string;
  lowTempLimit: number;
  forecast: Weather[];
}

const CITIES_CACHE_KEY = 'CitiesService.Cities';

@Injectable()
export class CitiesService {
  private interval = this.configService.get<number>('config.interval');
  private lowTempLimit = this.configService.get<number>('config.lowTempLimit');
  private cities = this.configService.get<string[][]>('config.cities');

  constructor(
    private configService: ConfigService,
    private forecastService: ForecastService,
    private schedularService: SchedulerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
  ) {
    this.getCitiesDocs();

    this.schedularService.addInterval(
      'ForecastService.fetchForecast',
      this.interval,
      async () => {
        const citiesDocs = await this.getCitiesDocs();

        citiesDocs.forEach(async (city) => {
          const forecast = await this.forecastService.fetchForecast(city);
          this.forecastService.updateForecast(forecast, city);
        });
      },
    );
  }

  private async getCitiesDocs() {
    const cashedCities = await this.cacheManager.get<CityDocument[]>(
      CITIES_CACHE_KEY,
    );

    if (cashedCities) return cashedCities;

    const citiesDocs = await Promise.all(
      this.cities.map(([name, country]) =>
        this.createOrUpdate({ name, country }),
      ),
    );

    return this.cacheManager.set<CityDocument[]>(CITIES_CACHE_KEY, citiesDocs, {
      ttl: null,
    });
  }

  createOrUpdate({ name, country }: CreateCityDto) {
    return this.cityModel
      .findOneAndUpdate(
        {
          name,
          country,
        },
        {},
        { upsert: true },
      )
      .exec();
  }

  async findAll(): Promise<ICity[]> {
    const cities = await this.getCitiesDocs();

    return Promise.all(
      cities.map(async ({ _id: id, name, country }) => {
        const forecastData = await this.forecastService.findByCityId(id);

        return {
          id,
          name,
          country,
          lowTempLimit: this.lowTempLimit,
          forecast: forecastData.map(({ date, minTemp }) => ({
            date,
            minTemp,
            isLowExceeded: minTemp < this.lowTempLimit,
          })),
        };
      }),
    );
  }

  async findOne(id: string): Promise<ICity | null> {
    const forecastData = await this.forecastService.findByCityId(id);

    if (forecastData.length === 0) return null;

    return {
      id: forecastData[0].city._id,
      name: forecastData[0].city.name,
      country: forecastData[0].city.country,
      lowTempLimit: this.lowTempLimit,
      forecast: forecastData.map(({ date, minTemp }) => ({
        date,
        minTemp,
        isLowExceeded: minTemp < this.lowTempLimit,
      })),
    };
  }
}
