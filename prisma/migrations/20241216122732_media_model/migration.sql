/*
  Warnings:

  - The values [STORE] on the enum `MediaOwnerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaPurpose" AS ENUM ('LOGO', 'BANNER', 'AVATAR', 'GALLERY', 'DOCUMENT', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "MediaOwnerType_new" AS ENUM ('STORE_PROFILE', 'PRODUCT', 'PRODUCT_VARIANT', 'COLLECTION', 'CATEGORY', 'USER_PROFILE', 'PROPERTY', 'VEHICLE');
ALTER TABLE "media" ALTER COLUMN "ownerType" TYPE "MediaOwnerType_new" USING ("ownerType"::text::"MediaOwnerType_new");
ALTER TYPE "MediaOwnerType" RENAME TO "MediaOwnerType_old";
ALTER TYPE "MediaOwnerType_new" RENAME TO "MediaOwnerType";
DROP TYPE "MediaOwnerType_old";
COMMIT;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "archivedAt" TIMESTAMP(6),
ADD COLUMN     "blurHash" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "placeholder" TEXT,
ADD COLUMN     "purpose" "MediaPurpose" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "storagePath" TEXT,
ADD COLUMN     "storageProvider" TEXT,
ADD COLUMN     "storageRegion" TEXT,
ADD COLUMN     "storeId" TEXT;

-- CreateIndex
CREATE INDEX "media_storeId_idx" ON "media"("storeId");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_purpose_idx" ON "media"("purpose");

-- CreateIndex
CREATE INDEX "media_isArchived_idx" ON "media"("isArchived");
