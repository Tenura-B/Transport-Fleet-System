import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRouteDto: CreateRouteDto) {
    try {
      return await this.prisma.client.route.create({
        data: createRouteDto as any,
      });
    } catch (error: any) {
      console.error("Error creating route:", error.message || error);
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.prisma.client.route.findMany({
      include: {
        assignedDrivers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const route = await this.prisma.client.route.findUnique({
      where: { id },
      include: {
        assignedDrivers: true,
      },
    });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    await this.findOne(id); // Check existence
    return this.prisma.client.route.update({
      where: { id },
      data: updateRouteDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.client.route.delete({
      where: { id },
    });
  }
}
