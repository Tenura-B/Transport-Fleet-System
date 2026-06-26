import { IsInt, IsString, Min, MinLength, IsOptional, IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(2)
  make: string;

  @IsString()
  @MinLength(2)
  model: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  @MinLength(2)
  registrationNumber: string;

  // Operational
  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  // Compliance
  @IsOptional()
  @IsDateString()
  insuranceExpiry?: string;

  @IsOptional()
  @IsDateString()
  roadworthinessExpiry?: string;

  @IsOptional()
  @IsDateString()
  registrationExpiry?: string;

  // Performance
  @IsOptional()
  @IsNumber()
  mileageKm?: number;

  @IsOptional()
  @IsNumber()
  fuelUsageAvg?: number;

  @IsOptional()
  @IsDateString()
  lastServiceDate?: string;

  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;
}
