import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  async create(dto: any, user: any) {
    // lógica para crear orden
  }
  async history(user: any) {
    // lógica para historial
  }
} 