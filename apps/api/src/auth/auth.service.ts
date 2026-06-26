import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        company: {
          create: {
            name: `${dto.email.split('@')[0]}'s Fleet`,
          }
        }
      },
      include: {
        company: true
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken: this.signToken(user.id, user.email, user.role, user.companyId),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.company.status === 'SUSPENDED') {
      throw new UnauthorizedException('Company account is suspended');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        companyId: user.companyId,
      },
      accessToken: this.signToken(user.id, user.email, user.role, user.companyId),
    };
  }

  private signToken(userId: string, email: string, role: string, companyId: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
      companyId,
    };

    return this.jwtService.sign(payload);
  }
}
