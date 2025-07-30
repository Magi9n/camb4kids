import { Controller, Post, Body, Get, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('operations')
@UseGuards(JwtAuthGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() operationData: any, @Request() req) {
    // Agregar el userId del usuario autenticado
    operationData.userId = req.user.id;
    return this.operationsService.create(operationData);
  }

  @Get('my-operations')
  async getMyOperations(@Request() req) {
    return this.operationsService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.operationsService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: { status: string; transferReference?: string }
  ) {
    return this.operationsService.updateStatus(id, data.status, data.transferReference);
  }
} 