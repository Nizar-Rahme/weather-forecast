import {
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CitiesService } from './cities.service';

interface Weather {
  date: Date;
  isLowExceeded: boolean;
  minTemp: number;
}

interface City {
  name: string;
  country: string;
  lowTempLimit: number;
  forecast: Weather[];
}

@Controller({ path: 'v1/cities' })
@UseInterceptors(CacheInterceptor)
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  findAll(@Query('limit', ParseIntPipe) limit: number): Promise<City[]> {
    return this.citiesService.findAll(limit);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<City> {
    const city = await this.citiesService.findOne(id, limit);

    if (city) return city;

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
