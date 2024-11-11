-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'SW', 'FR', 'AR', 'RW', 'LG');

-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('PHYSICAL_GOODS', 'REAL_ESTATE', 'VEHICLES');

-- CreateEnum
CREATE TYPE "StoreCurrency" AS ENUM ('KES', 'UGX', 'TZS', 'RWF', 'BIF', 'SSP');

-- CreateEnum
CREATE TYPE "CurrencyPosition" AS ENUM ('BEFORE_AMOUNT', 'AFTER_AMOUNT');

-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('IMPERIAL', 'METRIC');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('POUND', 'OUNCE', 'KILOGRAM', 'GRAM');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SalesChannel" AS ENUM ('ONLINE', 'IN_STORE');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'INDUSTRIAL', 'OFFICE');

-- CreateEnum
CREATE TYPE "PropertyFeature" AS ENUM ('FURNISHED', 'PARKING', 'SECURITY', 'WATER_TANK', 'BOREHOLE', 'GENERATOR', 'SWIMMING_POOL', 'GYM', 'ELEVATOR', 'CCTV', 'GARDEN');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'SUV', 'VAN', 'TRUCK', 'MOTORCYCLE', 'BUS');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "MediaOwnerType" AS ENUM ('PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY', 'COLLECTION', 'STORE', 'USER_PROFILE', 'PROPERTY', 'VEHICLE');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING', 'PICKUP', 'WAREHOUSE', 'REGISTERED');

-- CreateEnum
CREATE TYPE "AddressOwnerType" AS ENUM ('STORE', 'CUSTOMER', 'ORDER', 'PROPERTY', 'VEHICLE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "passwordHash" TEXT,
    "refreshTokenHash" TEXT,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "timeZone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "StoreType" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsApp" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "currency" "StoreCurrency" NOT NULL,
    "currencySymbol" TEXT,
    "currencyPosition" "CurrencyPosition" NOT NULL DEFAULT 'BEFORE_AMOUNT',
    "showCurrencyCode" BOOLEAN NOT NULL DEFAULT false,
    "unitSystem" "UnitSystem" NOT NULL DEFAULT 'METRIC',
    "weightUnit" "WeightUnit" NOT NULL DEFAULT 'KILOGRAM',
    "timeZone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "orderPrefix" TEXT DEFAULT '#',
    "orderSuffix" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "sku" TEXT,
    "available" INTEGER NOT NULL DEFAULT 0,
    "trackInventory" BOOLEAN NOT NULL DEFAULT false,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT,
    "salesChannels" "SalesChannel"[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "values" TEXT[],
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "optionCombination" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "sku" TEXT,
    "available" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "features" "PropertyFeature"[],
    "landSize" DECIMAL(10,2),
    "buildingSize" DECIMAL(10,2),
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parking" INTEGER,
    "yearBuilt" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "isRental" BOOLEAN NOT NULL DEFAULT false,
    "rentalPeriod" TEXT,
    "referenceNumber" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "storeId" TEXT NOT NULL,
    "salesChannels" "SalesChannel"[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "property_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "vehicleType" "VehicleType" NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "transmission" "TransmissionType" NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "engineSize" DECIMAL(4,1),
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "color" TEXT,
    "vin" TEXT,
    "licensePlate" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "enginePower" INTEGER,
    "fuelConsumption" DECIMAL(4,1),
    "condition" TEXT,
    "previousOwners" INTEGER,
    "serviceHistory" BOOLEAN,
    "referenceNumber" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "storeId" TEXT NOT NULL,
    "salesChannels" "SalesChannel"[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vehicle_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "fileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "thumbnail" TEXT,
    "modelFormat" TEXT,
    "ownerType" "MediaOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_phone_idx" ON "stores"("phone");

-- CreateIndex
CREATE INDEX "stores_whatsApp_idx" ON "stores"("whatsApp");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "product_options_productId_idx" ON "product_options"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_options_productId_name_key" ON "product_options"("productId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_optionCombination_key" ON "product_variants"("productId", "optionCombination");

-- CreateIndex
CREATE UNIQUE INDEX "property_listings_slug_key" ON "property_listings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "property_listings_referenceNumber_key" ON "property_listings"("referenceNumber");

-- CreateIndex
CREATE INDEX "property_listings_storeId_idx" ON "property_listings"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_listings_slug_key" ON "vehicle_listings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_listings_referenceNumber_key" ON "vehicle_listings"("referenceNumber");

-- CreateIndex
CREATE INDEX "vehicle_listings_storeId_idx" ON "vehicle_listings"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_storeId_idx" ON "categories"("storeId");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE INDEX "collections_storeId_idx" ON "collections"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_storeId_idx" ON "tags"("storeId");

-- CreateIndex
CREATE INDEX "media_ownerId_ownerType_idx" ON "media"("ownerId", "ownerType");

-- CreateIndex
CREATE UNIQUE INDEX "media_ownerId_ownerType_position_key" ON "media"("ownerId", "ownerType", "position");

-- CreateIndex
CREATE INDEX "address_owners_ownerId_ownerType_idx" ON "address_owners"("ownerId", "ownerType");

-- CreateIndex
CREATE INDEX "address_owners_addressId_idx" ON "address_owners"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "address_owners_ownerId_ownerType_type_isDefault_key" ON "address_owners"("ownerId", "ownerType", "type", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToProduct_AB_unique" ON "_CollectionToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToProduct_B_index" ON "_CollectionToProduct"("B");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_listings" ADD CONSTRAINT "vehicle_listings_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_owners" ADD CONSTRAINT "address_owners_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToProduct" ADD CONSTRAINT "_CollectionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToProduct" ADD CONSTRAINT "_CollectionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
