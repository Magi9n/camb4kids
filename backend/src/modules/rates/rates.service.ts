import { Injectable } from '@nestjs/common';

@Injectable()
export class RatesService {
  async getCurrent() {
    // lógica para obtener tasa actual
  }
  async getHistory(from: string, to: string) {
    // lógica para historial
  }
} 