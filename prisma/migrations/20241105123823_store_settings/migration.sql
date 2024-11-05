/*
  Warnings:

  - You are about to drop the column `description` on the `stores` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CurrencyPosition" AS ENUM ('BEFORE_AMOUNT', 'AFTER_AMOUNT');

-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('IMPERIAL', 'METRIC');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('POUND', 'OUNCE', 'KILOGRAM', 'GRAM');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING', 'PICKUP', 'WAREHOUSE', 'REGISTERED');

-- CreateEnum
CREATE TYPE "AddressOwnerType" AS ENUM ('STORE', 'CUSTOMER', 'ORDER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StoreCurrency" ADD VALUE 'KES';
ALTER TYPE "StoreCurrency" ADD VALUE 'TZS';
ALTER TYPE "StoreCurrency" ADD VALUE 'RWF';
ALTER TYPE "StoreCurrency" ADD VALUE 'BIF';
ALTER TYPE "StoreCurrency" ADD VALUE 'SSP';

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "description",
ADD COLUMN     "currencyPosition" "CurrencyPosition" NOT NULL DEFAULT 'BEFORE_AMOUNT',
ADD COLUMN     "currencySymbol" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "orderPrefix" TEXT DEFAULT '#',
ADD COLUMN     "orderSuffix" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "showCurrencyCode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
ADD COLUMN     "unitSystem" "UnitSystem" NOT NULL DEFAULT 'METRIC',
ADD COLUMN     "weightUnit" "WeightUnit" NOT NULL DEFAULT 'KILOGRAM',
ADD COLUMN     "whatsApp" TEXT;

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "line1" TEXT,
    "line2" TEXT,
    "zipCode" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address_owners" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "ownerType" "AddressOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "address_owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_owners_ownerId_ownerType_idx" ON "address_owners"("ownerId", "ownerType");

-- CreateIndex
CREATE INDEX "address_owners_addressId_idx" ON "address_owners"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "address_owners_ownerId_ownerType_type_isDefault_key" ON "address_owners"("ownerId", "ownerType", "type", "isDefault");

-- CreateIndex
CREATE INDEX "stores_phone_idx" ON "stores"("phone");

-- CreateIndex
CREATE INDEX "stores_whatsApp_idx" ON "stores"("whatsApp");

-- AddForeignKey
ALTER TABLE "address_owners" ADD CONSTRAINT "address_owners_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_owners" ADD CONSTRAINT "address_owners_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
