/*
  Warnings:

  - You are about to drop the column `storeId` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeType,slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeType` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_storeId_fkey";

-- DropIndex
DROP INDEX "categories_storeId_idx";

-- DropIndex
DROP INDEX "categories_storeId_slug_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "storeId",
ADD COLUMN     "storeType" "StoreType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeType_slug_key" ON "categories"("storeType", "slug");
