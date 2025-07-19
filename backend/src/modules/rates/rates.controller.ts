import { Controller, Get, Query } from '@nestjs/common';

@Controller('rates')
export class RatesController {
  @Get('current')
  async getCurrent() {
    // lógica para obtener tasa actual
    return { rate: 3.5 };
  }

  @Get('history')
  async getHistory(@Query('from') from: string, @Query('to') to: string) {
    // lógica para historial
    return { history: [] };
  }
} 