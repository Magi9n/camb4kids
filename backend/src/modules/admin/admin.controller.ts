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
  DefaultValuePipe,
  Req,
  ForbiddenException
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminService.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('orders')
  async getOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllOrders(page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('orders/:id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('cache/clear')
  async clearCache() {
    return this.adminService.clearCache();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }

  @Get('public-margins')
  async getPublicMargins(@Req() req) {
    const apiKey = req.headers['x-public-api-key'];
    console.log('🔍 Backend - Received headers:', Object.keys(req.headers));
    console.log('🔍 Backend - x-public-api-key received:', apiKey ? 'YES' : 'NO');
    console.log('🔍 Backend - API key length:', apiKey ? apiKey.length : 0);
    console.log('🔍 Backend - Expected key length:', process.env.PUBLIC_API_SECRET ? process.env.PUBLIC_API_SECRET.length : 0);
    console.log('🔍 Backend - Keys match:', apiKey === process.env.PUBLIC_API_SECRET);
    
    if (!apiKey || apiKey !== process.env.PUBLIC_API_SECRET) {
      console.log('❌ Backend - Authorization failed');
      throw new ForbiddenException('No autorizado');
    }
    
    console.log('✅ Backend - Authorization successful');
    const settings = await this.adminService.getSettings() as any;
    return {
      buyPercent: settings.buyPercent,
      sellPercent: settings.sellPercent,
    };
  }
} 