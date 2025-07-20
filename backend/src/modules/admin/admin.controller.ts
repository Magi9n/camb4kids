import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminService.updateSettings(dto);
  }

  @Get('orders')
  async getOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllOrders(page, limit);
  }

  @Put('orders/:id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Post('cache/clear')
  async clearCache() {
    return this.adminService.clearCache();
  }

  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }
} 
  @Post('cache/clear')
  async clearCache() {
    return this.adminService.clearCache();
  }

  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }
} 
  @Post('cache/clear')
  async clearCache() {
    return this.adminService.clearCache();
  }

  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }
} 
  @Post('cache/clear')
  async clearCache() {
    return this.adminService.clearCache();
  }

  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }
} 