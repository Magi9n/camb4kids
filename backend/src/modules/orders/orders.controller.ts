import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  Body, 
  UseGuards, 
  Request,
  ParseIntPipe,
  BadRequestException 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(dto, req.user);
  }

  @Get('history')
  async history(@Request() req) {
    return this.ordersService.history(req.user);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.findById(id, req.user);
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
    @Request() req
  ) {
    return this.ordersService.updateStatus(id, dto.status as OrderStatus, req.user);
  }
} 