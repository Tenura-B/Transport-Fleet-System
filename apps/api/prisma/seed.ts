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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
