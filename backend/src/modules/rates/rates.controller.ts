import { Controller, Get, Query, BadRequestException, Req, ForbiddenException } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get('current')
  async getCurrent(@Req() req) {
    const apiKey = req.headers['x-public-api-key'];
    console.log('🔍 Backend Rates - Received headers:', Object.keys(req.headers));
    console.log('🔍 Backend Rates - x-public-api-key received:', apiKey ? 'YES' : 'NO');
    console.log('🔍 Backend Rates - API key length:', apiKey ? apiKey.length : 0);
    console.log('🔍 Backend Rates - Expected key length:', process.env.PUBLIC_API_SECRET ? process.env.PUBLIC_API_SECRET.length : 0);
    console.log('🔍 Backend Rates - Keys match:', apiKey === process.env.PUBLIC_API_SECRET);
    
    if (!apiKey || apiKey !== process.env.PUBLIC_API_SECRET) {
      console.log('❌ Backend Rates - Authorization failed');
      throw new ForbiddenException('No autorizado');
    }
    
    console.log('✅ Backend Rates - Authorization successful');
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