/*
  Warnings:

  - You are about to drop the column `ownerId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `ownerType` on the `media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "media_ownerId_ownerType_idx";

-- DropIndex
DROP INDEX "media_ownerId_ownerType_position_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "ownerId",
DROP COLUMN "ownerType";

-- CreateTable
CREATE TABLE "media_ownerships" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerType" "MediaOwnerType" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "media_ownerships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_ownerships_mediaId_idx" ON "media_ownerships"("mediaId");

-- CreateIndex
CREATE INDEX "media_ownerships_ownerId_ownerType_idx" ON "media_ownerships"("ownerId", "ownerType");

-- CreateIndex
CREATE UNIQUE INDEX "media_ownerships_ownerId_ownerType_mediaId_key" ON "media_ownerships"("ownerId", "ownerType", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "media_ownerships_ownerId_ownerType_position_isDefault_key" ON "media_ownerships"("ownerId", "ownerType", "position", "isDefault");

-- AddForeignKey
ALTER TABLE "media_ownerships" ADD CONSTRAINT "media_ownerships_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
