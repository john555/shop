-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'SW', 'FR', 'AR', 'RW', 'LG');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'EN',
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'Africa/Nairobi';
