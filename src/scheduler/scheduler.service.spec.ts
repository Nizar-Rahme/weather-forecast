import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';

import { SchedulerService } from './scheduler.service';

jest.useFakeTimers();

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [SchedulerService],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addInterval', () => {
    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should run the provided callback immediately', () => {
      const interval = 10000;
      const callback = jest.fn();

      service.addInterval('test', interval, callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should run the provided callback when the interval is passed', () => {
      const interval = 10000;
      const callback = jest.fn();

      service.addInterval('test', interval, callback);
      jest.advanceTimersByTime(interval);

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
