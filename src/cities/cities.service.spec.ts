import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';

import { CitiesService } from './cities.service';
import { City } from './schemas/city.schema';
import { Forecast } from '../forecast/schemas/forecast.schema';
import { ForecastService } from '../forecast/forecast.service';
import { SchedulerModule } from '../scheduler/scheduler.module';

class ForecastModule {
  findByCityId(id: string) {
    return [];
  }
}

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register(),
        ScheduleModule.forRoot(),
        SchedulerModule,
      ],
      providers: [
        CitiesService,
        { provide: ForecastService, useClass: ForecastModule },
        {
          provide: getModelToken(City.name),
          useValue: {},
        },
        {
          provide: getModelToken(Forecast.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
