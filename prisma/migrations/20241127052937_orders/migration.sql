/*
  Warnings:

  - You are about to drop the column `categoryId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtPrice` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `customItemNote` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `discountReason` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `isCustom` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `actualDeliveryDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `cancelReason` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `currencyRate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDeliveryDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `fulfilledAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `fulfillmentType` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `isPriceOverridden` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `posTerminalId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `requiresShipping` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `salesChannel` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCarrier` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingTax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `taxCalculationType` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalPaid` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_gift_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_item_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_item_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_refunds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_shipment_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_shipments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_taxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_payment_providers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[storeId,orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountAmount` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `variantId` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `discountAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'FAILED');

-- DropForeignKey
ALTER TABLE "order_discounts" DROP CONSTRAINT "order_discounts_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_events" DROP CONSTRAINT "order_events_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_gift_cards" DROP CONSTRAINT "order_gift_cards_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_item_discounts" DROP CONSTRAINT "order_item_discounts_discountId_fkey";

-- DropForeignKey
ALTER TABLE "order_item_discounts" DROP CONSTRAINT "order_item_discounts_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "order_item_taxes" DROP CONSTRAINT "order_item_taxes_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "order_item_taxes" DROP CONSTRAINT "order_item_taxes_orderTaxId_fkey";

-- DropForeignKey
ALTER TABLE "order_notes" DROP CONSTRAINT "order_notes_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_payments" DROP CONSTRAINT "order_payments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_refunds" DROP CONSTRAINT "order_refunds_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_shipment_items" DROP CONSTRAINT "order_shipment_items_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "order_shipment_items" DROP CONSTRAINT "order_shipment_items_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "order_shipments" DROP CONSTRAINT "order_shipments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_taxes" DROP CONSTRAINT "order_taxes_orderId_fkey";

-- DropForeignKey
ALTER TABLE "store_payment_providers" DROP CONSTRAINT "store_payment_providers_storeId_fkey";

-- DropIndex
DROP INDEX "orders_orderNumber_idx";

-- DropIndex
DROP INDEX "orders_orderNumber_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "categoryId",
DROP COLUMN "categoryName",
DROP COLUMN "compareAtPrice",
DROP COLUMN "customItemNote",
DROP COLUMN "description",
DROP COLUMN "discount",
DROP COLUMN "discountReason",
DROP COLUMN "isCustom",
DROP COLUMN "slug",
DROP COLUMN "tax",
DROP COLUMN "total",
ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "taxAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "variantName" TEXT NOT NULL,
ALTER COLUMN "variantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "actualDeliveryDate",
DROP COLUMN "balance",
DROP COLUMN "cancelReason",
DROP COLUMN "createdById",
DROP COLUMN "currencyRate",
DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "discount",
DROP COLUMN "estimatedDeliveryDate",
DROP COLUMN "fulfilledAt",
DROP COLUMN "fulfillmentType",
DROP COLUMN "ipAddress",
DROP COLUMN "isPriceOverridden",
DROP COLUMN "posTerminalId",
DROP COLUMN "processedAt",
DROP COLUMN "requiresShipping",
DROP COLUMN "salesChannel",
DROP COLUMN "shippingAddress",
DROP COLUMN "shippingCarrier",
DROP COLUMN "shippingCost",
DROP COLUMN "shippingStatus",
DROP COLUMN "shippingTax",
DROP COLUMN "subtotal",
DROP COLUMN "tags",
DROP COLUMN "tax",
DROP COLUMN "taxCalculationType",
DROP COLUMN "total",
DROP COLUMN "totalPaid",
DROP COLUMN "updatedById",
DROP COLUMN "userAgent",
ADD COLUMN     "customerNotes" TEXT,
ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(6),
ADD COLUMN     "privateNotes" TEXT,
ADD COLUMN     "shipmentStatus" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shippingAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "subtotalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "taxAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "shippedAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "deliveredAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "cancelledAt" SET DATA TYPE TIMESTAMP(6);

-- DropTable
DROP TABLE "order_discounts";

-- DropTable
DROP TABLE "order_events";

-- DropTable
DROP TABLE "order_gift_cards";

-- DropTable
DROP TABLE "order_item_discounts";

-- DropTable
DROP TABLE "order_item_taxes";

-- DropTable
DROP TABLE "order_notes";

-- DropTable
DROP TABLE "order_payments";

-- DropTable
DROP TABLE "order_refunds";

-- DropTable
DROP TABLE "order_shipment_items";

-- DropTable
DROP TABLE "order_shipments";

-- DropTable
DROP TABLE "order_taxes";

-- DropTable
DROP TABLE "store_payment_providers";

-- CreateIndex
CREATE UNIQUE INDEX "orders_storeId_orderNumber_key" ON "orders"("storeId", "orderNumber");
