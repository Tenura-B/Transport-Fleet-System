import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  findAll(@Req() req) {
    return this.tripsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.tripsService.findOne(id, req.user.companyId);
  }

  @Post()
  create(@Body() data: any, @Req() req) {
    return this.tripsService.create(data, req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.tripsService.update(id, data, req.user.companyId);
  }
}
