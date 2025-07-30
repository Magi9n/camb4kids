import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RatesGateway {
  @WebSocketServer()
  server: Server;

  emitRateUpdate(rate: number) {
    this.server.emit('rateUpdate', { rate });
  }
} 