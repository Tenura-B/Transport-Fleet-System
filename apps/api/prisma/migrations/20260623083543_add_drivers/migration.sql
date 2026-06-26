-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'INACTIVE');

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT,
    "experienceYears" INTEGER NOT NULL,
    "previousEmployers" TEXT,
    "routeFamiliarity" TEXT,
    "trainingCerts" TEXT[],
    "assignedVehicleId" TEXT,
    "policeClearance" BOOLEAN NOT NULL DEFAULT false,
    "medicalFitness" BOOLEAN NOT NULL DEFAULT false,
    "insuranceCoverage" BOOLEAN NOT NULL DEFAULT false,
    "transportApproval" BOOLEAN NOT NULL DEFAULT false,
    "status" "DriverStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_nationalId_key" ON "Driver"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_assignedVehicleId_fkey" FOREIGN KEY ("assignedVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
