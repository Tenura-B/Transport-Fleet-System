import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fuel')
@UseGuards(JwtAuthGuard)
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  findAll(@Req() req) {
    return this.fuelService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.fuelService.findOne(id, req.user.companyId);
  }

  @Post()
  create(@Body() data: any, @Req() req) {
    return this.fuelService.create(data, req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.fuelService.update(id, data, req.user.companyId);
  }
}
