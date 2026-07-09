import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.fuelRecord.findMany({
      where: { companyId },
      include: {
        vehicle: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.fuelRecord.findUnique({
      where: { id, companyId },
      include: {
        vehicle: true,
      },
    });
  }

  async create(data: any, companyId: string) {
    return this.prisma.fuelRecord.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(id: string, data: any, companyId: string) {
    return this.prisma.fuelRecord.update({
      where: { id, companyId },
      data,
    });
  }
}
