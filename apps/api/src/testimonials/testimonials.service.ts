import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublicRandom() {
    // Basic approach: fetch all active and return a random one
    const activeTestimonials = await this.prisma.testimonial.findMany({
      where: { isActive: true },
    });
    
    if (activeTestimonials.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * activeTestimonials.length);
    return activeTestimonials[randomIndex];
  }

  async findPublicAll() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async create(data: { authorName: string; authorRole: string; content: string; rating?: number; isActive?: boolean }) {
    return this.prisma.testimonial.create({
      data,
    });
  }

  async update(id: string, data: { authorName?: string; authorRole?: string; content?: string; rating?: number; isActive?: boolean }) {
    await this.findOne(id); // ensure exists
    return this.prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // ensure exists
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
