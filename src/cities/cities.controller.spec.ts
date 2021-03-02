import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';
import { getModelToken } from '@nestjs/mongoose';

import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { ForecastService } from '../forecast/forecast.service';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { City } from './schemas/city.schema';
import { Forecast } from '../forecast/schemas/forecast.schema';

class ForecastModule {
  findByCityId(id: string) {
    return [];
  }
}

describe('CitiesController', () => {
  let controller: CitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register(),
        ScheduleModule.forRoot(),
        SchedulerModule,
      ],
      providers: [
        { provide: ForecastService, useClass: ForecastModule },
        {
          provide: getModelToken(City.name),
          useValue: {},
        },
        {
          provide: getModelToken(Forecast.name),
          useValue: {},
        },
        CitiesService,
      ],
      controllers: [CitiesController],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
