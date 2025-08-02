import { Controller, Get, Query, BadRequestException, Req, ForbiddenException } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get('current')
  async getCurrent(@Req() req) {
    const origin = req.headers['origin'] || req.headers['referer'] || '';
    if (origin && !origin.includes('cambio.mate4kids.com')) {
      throw new ForbiddenException('No autorizado');
    }
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

  @Get('daily-averages')
  async getDailyAverages() {
    return this.ratesService.getDailyAverages();
  }
} 