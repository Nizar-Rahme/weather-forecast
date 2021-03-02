import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ForecastService } from './forecast.service';
import { Forecast } from './schemas/forecast.schema';

describe('ForecastService', () => {
  let service: ForecastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ ignoreEnvFile: true })],
      providers: [
        ForecastService,
        {
          provide: getModelToken(Forecast.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ForecastService>(ForecastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
