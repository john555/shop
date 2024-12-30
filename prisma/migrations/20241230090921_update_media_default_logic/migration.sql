/*
  Warnings:

  - You are about to drop the column `position` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `media_ownerships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,ownerType,position]` on the table `media_ownerships` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "media_ownerships_ownerId_ownerType_position_isDefault_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "media_ownerships" DROP COLUMN "isDefault";

-- CreateIndex
CREATE UNIQUE INDEX "media_ownerships_ownerId_ownerType_position_key" ON "media_ownerships"("ownerId", "ownerType", "position");
