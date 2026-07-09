import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalVehicles, activeVehicles,
      totalDrivers, activeDrivers,
      totalRoutes,
      activeTrips
    ] = await Promise.all([
      this.prisma.client.vehicle.count(),
      this.prisma.client.vehicle.count({ where: { status: 'IN_USE' } }),
      this.prisma.client.driver.count(),
      this.prisma.client.driver.count({ where: { status: 'ACTIVE' } }),
      this.prisma.client.route.count(),
      this.prisma.client.trip.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    return {
      vehicles: { total: totalVehicles, active: activeVehicles },
      drivers: { total: totalDrivers, active: activeDrivers },
      routes: { total: totalRoutes },
      trips: { active: activeTrips },
    };
  }
}
