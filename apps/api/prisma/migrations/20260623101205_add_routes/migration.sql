-- CreateEnum
CREATE TYPE "RouteType" AS ENUM ('CITY', 'SUBURBAN', 'LONG_DISTANCE', 'EXPRESS', 'NIGHT');

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "assignedRouteId" TEXT;

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "routeCode" TEXT NOT NULL,
    "startPoint" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "intermediateStops" TEXT[],
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "estimatedDurationMins" INTEGER NOT NULL,
    "operatingHours" TEXT NOT NULL,
    "routeType" "RouteType" NOT NULL,
    "punctualityScore" INTEGER NOT NULL DEFAULT 100,
    "complaintsCount" INTEGER NOT NULL DEFAULT 0,
    "safetyIncidents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeCode_key" ON "Route"("routeCode");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_assignedRouteId_fkey" FOREIGN KEY ("assignedRouteId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;
