import { CacheModule, HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { ForecastService } from '../forecast/forecast.service';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { City } from './schemas/city.schema';
import { City as ICity } from './interfaces/city.interface';
import { Forecast } from '../forecast/schemas/forecast.schema';

class ForecastModule {
  findByCityId(id: string) {
    return [];
  }
}

const mockCity: ICity = {
  id: new Types.ObjectId('603e45c0cf2c7cfe404cb0d3'),
  name: 'Helsinki',
  country: 'FI',
  lowTempLimit: 1,
  forecast: [
    {
      date: new Date(),
      minTemp: -3,
      isLowExceeded: true,
    },
  ],
};

describe('CitiesController', () => {
  let controller: CitiesController;
  let citiesService: CitiesService;

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
    citiesService = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      expect.assertions(1);

      const result = [mockCity];
      jest
        .spyOn(citiesService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.findAll(1)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return the corresponding city', async () => {
      expect.assertions(1);

      const result = mockCity;

      jest
        .spyOn(citiesService, 'findOne')
        .mockImplementation(async () => result);

      expect(await controller.findOne('603e45c0cf2c7cfe404cb0d3', 1)).toBe(
        result,
      );
    });

    it('should throw an HttpException when the resource is not found', async () => {
      expect.assertions(1);

      jest.spyOn(citiesService, 'findOne').mockImplementation(async () => null);

      const findOne = () => controller.findOne('random', 1);

      await expect(findOne).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
