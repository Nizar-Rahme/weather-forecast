import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  private readonly url = this.configService.get<string>('forecastAPI.url');
  private readonly key = this.configService.get<string>('forecastAPI.key');

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.http.pingCheck('openweathermap-api', this.url, {
          params: {
            q: `Helsinki,FI`,
            appid: this.key,
          },
        }),
      async () => this.mongoose.pingCheck('mongoose'),
    ]);
  }
}
