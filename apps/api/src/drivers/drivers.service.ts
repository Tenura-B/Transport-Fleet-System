import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    // Check if assignedVehicleId is valid if provided
    if (createDriverDto.assignedVehicleId) {
      const vehicle = await this.prisma.client.vehicle.findUnique({
        where: { id: createDriverDto.assignedVehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${createDriverDto.assignedVehicleId} not found`);
      }
    }
    
    // Check if assignedRouteId is valid if provided
    if (createDriverDto.assignedRouteId) {
      const route = await this.prisma.client.route.findUnique({
        where: { id: createDriverDto.assignedRouteId },
      });
      if (!route) {
        throw new NotFoundException(`Route with ID ${createDriverDto.assignedRouteId} not found`);
      }
    }

    // Ensure dates are parsed correctly
    const data = {
      ...createDriverDto,
      dateOfBirth: new Date(createDriverDto.dateOfBirth),
      licenseExpiry: new Date(createDriverDto.licenseExpiry),
    };

    return this.prisma.client.driver.create({
      data: data as any,
    });
  }

  findAll() {
    return this.prisma.client.driver.findMany({
      include: {
        assignedVehicle: true,
        assignedRoute: true,
      },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.client.driver.findUnique({
      where: { id },
      include: {
        assignedVehicle: true,
        assignedRoute: true,
      },
    });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    await this.findOne(id); // Ensure exists

    const data: any = { ...updateDriverDto };
    const dto = updateDriverDto as any;
    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }
    if (dto.licenseExpiry) {
      data.licenseExpiry = new Date(dto.licenseExpiry);
    }

    return this.prisma.client.driver.update({
      where: { id },
      data,
      include: {
        assignedVehicle: true,
        assignedRoute: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.client.driver.delete({
      where: { id },
    });
  }
}
