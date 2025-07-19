import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getSettings() {
    // lógica para obtener ajustes
  }
  async updateSettings(dto: any) {
    // lógica para actualizar ajustes
  }
  async getOrders() {
    // lógica para listar órdenes
  }
  async updateOrder(id: string, dto: any) {
    // lógica para actualizar estado de orden
  }
} 