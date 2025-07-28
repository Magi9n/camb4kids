import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get('current')
  async getCurrent() {
    return this.ratesService.getCurrent();
  }

  @Get('history')
  async getHistory(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) throw new BadRequestException('Debe indicar from y to');
    return this.ratesService.getHistory(from, to);
  }

  @Get('hourly')
  async getHourly() {
    return this.ratesService.getHourly();
  }
} 