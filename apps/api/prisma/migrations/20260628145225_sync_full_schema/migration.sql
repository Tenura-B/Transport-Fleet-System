/*
  Warnings:

  - A unique constraint covering the columns `[companyId,email]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,nationalId]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,licenseNumber]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,routeCode]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,registrationNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- AlterEnum
ALTER TYPE "VehicleStatus" ADD VALUE 'RETIRED';

-- DropIndex
DROP INDEX "Driver_email_key";

-- DropIndex
DROP INDEX "Driver_licenseNumber_key";

-- DropIndex
DROP INDEX "Driver_nationalId_key";

-- DropIndex
DROP INDEX "Route_routeCode_key";

-- DropIndex
DROP INDEX "Vehicle_registrationNumber_key";

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 40,
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "fuelUsageAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "insuranceExpiry" TIMESTAMP(3),
ADD COLUMN     "lastServiceDate" TIMESTAMP(3),
ADD COLUMN     "mileageKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "nextServiceDate" TIMESTAMP(3),
ADD COLUMN     "registrationExpiry" TIMESTAMP(3),
ADD COLUMN     "roadworthinessExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "domain" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "Company"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_companyId_email_key" ON "Driver"("companyId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_companyId_nationalId_key" ON "Driver"("companyId", "nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_companyId_licenseNumber_key" ON "Driver"("companyId", "licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Route_companyId_routeCode_key" ON "Route"("companyId", "routeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_companyId_registrationNumber_key" ON "Vehicle"("companyId", "registrationNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
