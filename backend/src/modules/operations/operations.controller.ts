import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('operations')
@UseGuards(JwtAuthGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    // El usuario autenticado está en req.user
    const user = req.user;
    return this.operationsService.create({
      ...body,
      userId: user.id
    });
  }
} 