import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, IsInt, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { DriverStatus } from '@prisma/client';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  licenseType: string;

  @IsDateString()
  @IsNotEmpty()
  licenseExpiry: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsInt()
  @IsNotEmpty()
  experienceYears: number;

  @IsString()
  @IsOptional()
  previousEmployers?: string;

  @IsString()
  @IsOptional()
  routeFamiliarity?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trainingCerts?: string[];

  @IsString()
  @IsOptional()
  assignedVehicleId?: string;

  @IsString()
  @IsOptional()
  assignedRouteId?: string;

  @IsBoolean()
  @IsOptional()
  policeClearance?: boolean;

  @IsBoolean()
  @IsOptional()
  medicalFitness?: boolean;

  @IsBoolean()
  @IsOptional()
  insuranceCoverage?: boolean;

  @IsBoolean()
  @IsOptional()
  transportApproval?: boolean;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;
}
