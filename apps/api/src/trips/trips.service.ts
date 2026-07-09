import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.trip.findMany({
      where: { companyId },
      include: {
        route: true,
        vehicle: true,
        driver: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.trip.findUnique({
      where: { id, companyId },
      include: {
        route: true,
        vehicle: true,
        driver: true,
      },
    });
  }

  async create(data: any, companyId: string) {
    return this.prisma.trip.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(id: string, data: any, companyId: string) {
    return this.prisma.trip.update({
      where: { id, companyId },
      data,
    });
  }
}
