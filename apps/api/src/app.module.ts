import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { RoutesModule } from './routes/routes.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { CompaniesModule } from './companies/companies.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FuelModule } from './fuel/fuel.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, AuthModule, VehiclesModule, DriversModule, RoutesModule, CompaniesModule, TestimonialsModule, FuelModule, MaintenanceModule, AlertsModule, DashboardModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}