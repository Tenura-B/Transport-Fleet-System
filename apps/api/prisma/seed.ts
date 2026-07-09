import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@example.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        company: {
          create: {
            name: 'System Admin Company',
          }
        }
      },
    });
    
    console.log('✅ Admin user created successfully: admin@example.com / admin123');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  const devEmail = 'developer@ceytrex.com';
  
  const existingDev = await prisma.user.findUnique({
    where: { email: devEmail },
  });

  if (!existingDev) {
    const hashedPassword = await bcrypt.hash('developer123', 10);
    
    await prisma.user.create({
      data: {
        email: devEmail,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        company: {
          create: {
            name: 'CeyTrex System Administration',
          }
        }
      },
    });
    
    console.log('✅ Super Admin user created successfully: developer@ceytrex.com / developer123');
  } else {
    console.log('ℹ️ Super Admin user already exists.');
  }

  const existingTestimonial = await prisma.testimonial.findFirst();
  if (!existingTestimonial) {
    await prisma.testimonial.createMany({
      data: [
        {
          authorName: "John Anderson",
          authorRole: "Fleet Manager at Logistics Pro",
          content: "Managing our fleet has never been easier. The dashboard gives us complete visibility and control over all our vehicles and drivers.",
          rating: 5,
        },
        {
          authorName: "Sarah Jenkins",
          authorRole: "Operations Director",
          content: "Since we started using this system, our maintenance costs have dropped by 20% due to predictive alerts. Highly recommended!",
          rating: 5,
        },
        {
          authorName: "Mike Chen",
          authorRole: "Dispatcher at QuickFreight",
          content: "The live tracking and route optimization has completely transformed how we assign trips. Our drivers love it.",
          rating: 4,
        }
      ]
    });
    console.log('✅ Default testimonials seeded.');
  } else {
    console.log('ℹ️ Testimonials already exist.');
  }

  const company = await prisma.company.findFirst();
  if (company) {
    const existingVehicles = await prisma.vehicle.count();
    if (existingVehicles === 0) {
      await prisma.vehicle.createMany({
        data: [
          { companyId: company.id, make: "Volvo", model: "B11R", year: 2021, registrationNumber: "WP-ND-1023", capacity: 54, status: "IN_USE", mileageKm: 120000, features: ["AC", "GPS", "CCTV"] },
          { companyId: company.id, make: "Scania", model: "K410", year: 2022, registrationNumber: "WP-ND-4451", capacity: 45, status: "AVAILABLE", mileageKm: 85000, features: ["AC", "WIFI"] },
          { companyId: company.id, make: "Ashok Leyland", model: "Viking", year: 2019, registrationNumber: "WP-NB-8899", capacity: 60, status: "MAINTENANCE", mileageKm: 310000, features: ["GPS"] },
          { companyId: company.id, make: "Tata", model: "Marcopolo", year: 2023, registrationNumber: "WP-NE-1002", capacity: 42, status: "IN_USE", mileageKm: 25000, features: ["AC", "GPS", "CCTV", "WHEELCHAIR"] },
          { companyId: company.id, make: "Mercedes-Benz", model: "Tourismo", year: 2020, registrationNumber: "WP-NC-5544", capacity: 50, status: "AVAILABLE", mileageKm: 180000, features: ["AC", "WIFI", "GPS"] },
        ]
      });
      console.log('✅ Seeded 5 Vehicles.');
    }

    const existingDrivers = await prisma.driver.count();
    if (existingDrivers === 0) {
      await prisma.driver.createMany({
        data: [
          { companyId: company.id, fullName: "Sunil Perera", email: "sunil@example.com", contactNumber: "0771234567", nationalId: "851234567V", dateOfBirth: new Date("1985-05-12"), address: "Colombo", licenseNumber: "B1234567", licenseType: "HEAVY", licenseExpiry: new Date("2028-05-12"), experienceYears: 12, status: "ACTIVE", policeClearance: true, medicalFitness: true },
          { companyId: company.id, fullName: "Kamal Silva", email: "kamal@example.com", contactNumber: "0719876543", nationalId: "901987654V", dateOfBirth: new Date("1990-11-23"), address: "Kandy", licenseNumber: "B9876543", licenseType: "HEAVY", licenseExpiry: new Date("2025-11-23"), experienceYears: 8, status: "ACTIVE", policeClearance: true, medicalFitness: true },
          { companyId: company.id, fullName: "Nimal Fernando", email: "nimal@example.com", contactNumber: "0755555555", nationalId: "821555555V", dateOfBirth: new Date("1982-01-15"), address: "Galle", licenseNumber: "B5555555", licenseType: "HEAVY", licenseExpiry: new Date("2029-01-15"), experienceYears: 15, status: "ON_LEAVE", policeClearance: true, medicalFitness: false },
          { companyId: company.id, fullName: "Ruwan Kumara", email: "ruwan@example.com", contactNumber: "0722222222", nationalId: "921222222V", dateOfBirth: new Date("1992-08-08"), address: "Negombo", licenseNumber: "B2222222", licenseType: "HEAVY", licenseExpiry: new Date("2027-08-08"), experienceYears: 5, status: "ACTIVE", policeClearance: true, medicalFitness: true },
          { companyId: company.id, fullName: "Ajith Bandara", email: "ajith@example.com", contactNumber: "0788888888", nationalId: "881888888V", dateOfBirth: new Date("1988-04-30"), address: "Matara", licenseNumber: "B8888888", licenseType: "HEAVY", licenseExpiry: new Date("2026-04-30"), experienceYears: 10, status: "ACTIVE", policeClearance: false, medicalFitness: true },
        ]
      });
      console.log('✅ Seeded 5 Drivers.');
    }

    const existingRoutes = await prisma.route.count();
    if (existingRoutes === 0) {
      await prisma.route.createMany({
        data: [
          { companyId: company.id, routeCode: "R-100", startPoint: "Colombo", endPoint: "Kandy", intermediateStops: ["Kadawatha", "Kegalle", "Peradeniya"], distanceKm: 115, estimatedDurationMins: 180, operatingHours: "05:00 - 22:00", routeType: "EXPRESS", punctualityScore: 92, complaintsCount: 2, safetyIncidents: 0 },
          { companyId: company.id, routeCode: "R-101", startPoint: "Galle", endPoint: "Matara", intermediateStops: ["Unawatuna", "Weligama"], distanceKm: 45, estimatedDurationMins: 60, operatingHours: "06:00 - 20:00", routeType: "CITY", punctualityScore: 95, complaintsCount: 0, safetyIncidents: 0 },
          { companyId: company.id, routeCode: "R-102", startPoint: "Kurunegala", endPoint: "Negombo", intermediateStops: ["Giriulla", "Pannala"], distanceKm: 75, estimatedDurationMins: 120, operatingHours: "04:30 - 19:30", routeType: "SUBURBAN", punctualityScore: 88, complaintsCount: 5, safetyIncidents: 1 },
        ]
      });
      console.log('✅ Seeded 3 Routes.');
    }

    // After we know we have vehicles, drivers, and routes, we fetch them to link up the trips
    const routes = await prisma.route.findMany({ where: { companyId: company.id } });
    const vehicles = await prisma.vehicle.findMany({ where: { companyId: company.id } });
    const drivers = await prisma.driver.findMany({ where: { companyId: company.id } });

    if (routes.length > 0 && vehicles.length > 0 && drivers.length > 0) {
      const existingTrips = await prisma.trip.count();
      if (existingTrips === 0) {
        await prisma.trip.createMany({
          data: [
            { companyId: company.id, routeId: routes[0 % routes.length].id, vehicleId: vehicles[0 % vehicles.length].id, driverId: drivers[0 % drivers.length].id, status: "IN_PROGRESS", progressPercent: 65, passengers: 42, revenue: 12500, scheduledDeparture: new Date(), scheduledArrival: new Date(new Date().getTime() + 180 * 60000) },
            { companyId: company.id, routeId: routes[1 % routes.length].id, vehicleId: vehicles[1 % vehicles.length].id, driverId: drivers[1 % drivers.length].id, status: "SCHEDULED", progressPercent: 0, passengers: 0, revenue: 0, scheduledDeparture: new Date(new Date().getTime() + 60 * 60000), scheduledArrival: new Date(new Date().getTime() + 120 * 60000) },
            { companyId: company.id, routeId: routes[2 % routes.length].id, vehicleId: vehicles[2 % vehicles.length].id, driverId: drivers[2 % drivers.length].id, status: "COMPLETED", progressPercent: 100, passengers: 55, revenue: 16500, scheduledDeparture: new Date(new Date().getTime() - 240 * 60000), actualDeparture: new Date(new Date().getTime() - 235 * 60000), scheduledArrival: new Date(new Date().getTime() - 120 * 60000), actualArrival: new Date(new Date().getTime() - 110 * 60000) },
            { companyId: company.id, routeId: routes[0 % routes.length].id, vehicleId: vehicles[3 % vehicles.length].id, driverId: drivers[3 % drivers.length].id, status: "DELAYED", progressPercent: 30, passengers: 38, revenue: 11400, scheduledDeparture: new Date(new Date().getTime() - 60 * 60000), actualDeparture: new Date(new Date().getTime() - 15 * 60000), scheduledArrival: new Date(new Date().getTime() + 120 * 60000) },
          ]
        });
        console.log('✅ Seeded 4 Trips.');
      }

      const existingFuel = await prisma.fuelRecord.count();
      if (existingFuel === 0) {
        await prisma.fuelRecord.createMany({
          data: [
            { companyId: company.id, vehicleId: vehicles[0 % vehicles.length].id, date: new Date(new Date().getTime() - 86400000), liters: 45.5, cost: 16000, mileageAtFill: 120000 },
            { companyId: company.id, vehicleId: vehicles[1 % vehicles.length].id, date: new Date(new Date().getTime() - 172800000), liters: 38.0, cost: 13500, mileageAtFill: 84800 },
            { companyId: company.id, vehicleId: vehicles[2 % vehicles.length].id, date: new Date(new Date().getTime() - 259200000), liters: 60.0, cost: 21500, mileageAtFill: 309800 },
            { companyId: company.id, vehicleId: vehicles[3 % vehicles.length].id, date: new Date(new Date().getTime() - 345600000), liters: 42.5, cost: 15200, mileageAtFill: 24500 },
            { companyId: company.id, vehicleId: vehicles[0 % vehicles.length].id, date: new Date(new Date().getTime() - 432000000), liters: 50.0, cost: 17800, mileageAtFill: 119500 },
          ]
        });
        console.log('✅ Seeded 5 Fuel Records.');
      }

      const existingMaintenance = await prisma.maintenanceRecord.count();
      if (existingMaintenance === 0) {
        await prisma.maintenanceRecord.createMany({
          data: [
            { companyId: company.id, vehicleId: vehicles[2 % vehicles.length].id, type: "Engine Overhaul", description: "Major engine repair", dateScheduled: new Date(new Date().getTime() - 86400000 * 3), status: "IN_PROGRESS", cost: 0 },
            { companyId: company.id, vehicleId: vehicles[0 % vehicles.length].id, type: "Routine Service", description: "Oil and filter change", dateScheduled: new Date(new Date().getTime() - 86400000 * 10), dateCompleted: new Date(new Date().getTime() - 86400000 * 9), status: "COMPLETED", cost: 15000 },
            { companyId: company.id, vehicleId: vehicles[4 % vehicles.length].id, type: "Brake Inspection", description: "Replace worn brake pads", dateScheduled: new Date(new Date().getTime() + 86400000 * 5), status: "SCHEDULED", cost: 0 },
            { companyId: company.id, vehicleId: vehicles[1 % vehicles.length].id, type: "Tire Replacement", description: "Replace 4 rear tires", dateScheduled: new Date(new Date().getTime() - 86400000 * 15), dateCompleted: new Date(new Date().getTime() - 86400000 * 14), status: "COMPLETED", cost: 120000 },
          ]
        });
        console.log('✅ Seeded 4 Maintenance Records.');
      }

      const existingAlerts = await prisma.alert.count();
      if (existingAlerts === 0) {
        await prisma.alert.createMany({
          data: [
            { companyId: company.id, title: "Trip Delayed", message: "Trip for vehicle WP-NE-1002 is delayed by 45 minutes.", severity: "WARNING", isRead: false },
            { companyId: company.id, title: "Maintenance Required", message: "Vehicle WP-NB-8899 is currently undergoing major maintenance.", severity: "CRITICAL", isRead: false },
            { companyId: company.id, title: "License Expiring", message: "Driver Kamal Silva's heavy vehicle license will expire in 30 days.", severity: "INFO", isRead: false },
            { companyId: company.id, title: "Fuel Usage High", message: "Vehicle WP-ND-1023 reported higher than average fuel consumption this week.", severity: "WARNING", isRead: true },
          ]
        });
        console.log('✅ Seeded 4 Alerts.');
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
