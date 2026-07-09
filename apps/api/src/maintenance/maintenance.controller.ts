import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  findAll(@Req() req) {
    return this.maintenanceService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.maintenanceService.findOne(id, req.user.companyId);
  }

  @Post()
  create(@Body() data: any, @Req() req) {
    return this.maintenanceService.create(data, req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.maintenanceService.update(id, data, req.user.companyId);
  }
}
