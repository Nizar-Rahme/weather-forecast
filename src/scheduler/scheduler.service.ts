import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  addInterval(name: string, milliseconds: number, callback: () => void) {
    callback();
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }
}
