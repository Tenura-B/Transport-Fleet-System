import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.maintenanceRecord.findMany({
      where: { companyId },
      include: {
        vehicle: true,
      },
      orderBy: { dateScheduled: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.maintenanceRecord.findUnique({
      where: { id, companyId },
      include: {
        vehicle: true,
      },
    });
  }

  async create(data: any, companyId: string) {
    return this.prisma.maintenanceRecord.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(id: string, data: any, companyId: string) {
    return this.prisma.maintenanceRecord.update({
      where: { id, companyId },
      data,
    });
  }
}
