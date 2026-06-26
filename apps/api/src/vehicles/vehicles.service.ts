import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return this.prisma.client.vehicle.create({
      data: createVehicleDto as any,
      include: { drivers: true },
    });
  }

  async findAll() {
    return this.prisma.client.vehicle.findMany({
      include: { drivers: true },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.client.vehicle.findUnique({
      where: { id },
      include: { drivers: true },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.client.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: { drivers: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.client.vehicle.delete({
      where: { id },
    });
  }
}
