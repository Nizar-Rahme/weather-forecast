import { CacheModule, Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ForecastModule } from '../forecast/forecast.module';
import { CitiesService } from './cities.service';
import { City, CitySchema } from './schemas/city.schema';
import { Forecast, ForecastSchema } from '../forecast/schemas/forecast.schema';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: City.name, schema: CitySchema },
      { name: Forecast.name, schema: ForecastSchema },
    ]),
    SchedulerModule,
    ForecastModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
