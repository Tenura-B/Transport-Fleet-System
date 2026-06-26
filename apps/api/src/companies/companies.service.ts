import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.client.company.create({
      data: createCompanyDto as any,
    });
  }

  findAll() {
    return this.prisma.client.company.findMany({
      include: {
        _count: {
          select: { users: true, vehicles: true, drivers: true, routes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.client.company.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.prisma.client.company.update({
      where: { id },
      data: updateCompanyDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.company.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') {
    await this.findOne(id);
    return this.prisma.client.company.update({
      where: { id },
      data: { status },
    });
  }
}
