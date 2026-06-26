import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
