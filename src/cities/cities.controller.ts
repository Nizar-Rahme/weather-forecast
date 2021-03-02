import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

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
  findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<City> {
    const city = await this.citiesService.findOne(id);

    if (city) return city;

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    await this.citiesService.createOrUpdate(createCityDto);
  }
}
