import { IsString, IsNotEmpty, IsArray, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum RouteTypeEnum {
  CITY = 'CITY',
  SUBURBAN = 'SUBURBAN',
  LONG_DISTANCE = 'LONG_DISTANCE',
  EXPRESS = 'EXPRESS',
  NIGHT = 'NIGHT'
}

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  routeCode: string;

  @IsString()
  @IsNotEmpty()
  startPoint: string;

  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  intermediateStops?: string[];

  @IsNumber()
  @IsNotEmpty()
  distanceKm: number;

  @IsNumber()
  @IsNotEmpty()
  estimatedDurationMins: number;

  @IsString()
  @IsNotEmpty()
  operatingHours: string;

  @IsEnum(RouteTypeEnum)
  @IsNotEmpty()
  routeType: any;
}
