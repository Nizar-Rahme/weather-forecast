import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ForecastService } from './forecast.service';
import { Forecast, ForecastSchema } from './schemas/forecast.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Forecast.name, schema: ForecastSchema },
    ]),
  ],
  providers: [ForecastService],
  exports: [ForecastService],
})
export class ForecastModule {}
