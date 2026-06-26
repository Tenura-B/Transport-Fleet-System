import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting tenant migration...');

  // 1. Create a Default Company if none exists
  let defaultCompany = await prisma.company.findFirst({
    where: { name: 'Legacy Operations' },
  });

  if (!defaultCompany) {
    defaultCompany = await prisma.company.create({
      data: {
        name: 'Legacy Operations',
        domain: 'legacy',
      },
    });
    console.log(`Created Default Company: ${defaultCompany.id}`);
  } else {
    console.log(`Found Default Company: ${defaultCompany.id}`);
  }

  // 2. Backfill Users
  const userResult = await prisma.$executeRaw`UPDATE "User" SET "companyId" = ${defaultCompany.id} WHERE "companyId" IS NULL`;
  console.log(`Migrated Users: ${userResult}`);

  // 3. Backfill Vehicles
  const vehicleResult = await prisma.$executeRaw`UPDATE "Vehicle" SET "companyId" = ${defaultCompany.id} WHERE "companyId" IS NULL`;
  console.log(`Migrated Vehicles: ${vehicleResult}`);

  // 4. Backfill Drivers
  const driverResult = await prisma.$executeRaw`UPDATE "Driver" SET "companyId" = ${defaultCompany.id} WHERE "companyId" IS NULL`;
  console.log(`Migrated Drivers: ${driverResult}`);

  // 5. Backfill Routes
  const routeResult = await prisma.$executeRaw`UPDATE "Route" SET "companyId" = ${defaultCompany.id} WHERE "companyId" IS NULL`;
  console.log(`Migrated Routes: ${routeResult}`);

  console.log('Tenant migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
