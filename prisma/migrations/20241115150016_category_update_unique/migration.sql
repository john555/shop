/*
  Warnings:

  - A unique constraint covering the columns `[storeId,slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `property_listings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `vehicle_listings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "categories_slug_key";

-- DropIndex
DROP INDEX "collections_slug_key";

-- DropIndex
DROP INDEX "products_slug_key";

-- DropIndex
DROP INDEX "property_listings_slug_key";

-- DropIndex
DROP INDEX "stores_slug_key";

-- DropIndex
DROP INDEX "tags_slug_key";

-- DropIndex
DROP INDEX "vehicle_listings_slug_key";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "marketingSMS" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_storeId_idx" ON "Customer"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_storeId_email_key" ON "Customer"("storeId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_storeId_phoneNumber_key" ON "Customer"("storeId", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_slug_key" ON "categories"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_storeId_slug_key" ON "collections"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "property_listings_storeId_slug_key" ON "property_listings"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "stores_ownerId_slug_key" ON "stores"("ownerId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_storeId_slug_key" ON "tags"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_listings_storeId_slug_key" ON "vehicle_listings"("storeId", "slug");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
