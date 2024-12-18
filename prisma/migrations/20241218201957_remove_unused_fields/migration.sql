/*
  Warnings:

  - You are about to drop the column `storagePath` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `storageProvider` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `storageRegion` on the `media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "storagePath",
DROP COLUMN "storageProvider",
DROP COLUMN "storageRegion";
