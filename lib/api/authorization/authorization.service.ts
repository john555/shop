import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  // Individual resource checks
  async canAccessStore(userId: string, storeId: string): Promise<boolean> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { ownerId: true },
    });
    return store?.ownerId === userId;
  }

  async canAccessProduct(userId: string, productId: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { store: { select: { ownerId: true } } },
    });
    return product?.store?.ownerId === userId;
  }

  async canAccessCategory(
    userId: string,
    categoryId: string
  ): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { store: { select: { ownerId: true } } },
    });
    return category?.store?.ownerId === userId;
  }

  async canAccessCollection(
    userId: string,
    collectionId: string
  ): Promise<boolean> {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
      select: { store: { select: { ownerId: true } } },
    });
    return collection?.store?.ownerId === userId;
  }

  async canAccessCustomer(
    userId: string,
    customerId: string
  ): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        store: {
          select: { ownerId: true },
        },
      },
    });

    return customer?.store?.ownerId === userId;
  }

  // Bulk authorization methods
  async validateBulkStoreAccess(
    userId: string,
    storeIds: string[]
  ): Promise<void> {
    const stores = await this.prisma.store.findMany({
      where: { id: { in: storeIds } },
      select: { id: true, ownerId: true },
    });

    // Check if all stores were found
    if (stores.length !== storeIds.length) {
      const foundIds = new Set(stores.map((store) => store.id));
      const missingIds = storeIds.filter((id) => !foundIds.has(id));
      throw new UnauthorizedException(
        `Stores not found: ${missingIds.join(', ')}`
      );
    }

    // Check if user has access to all stores
    const unauthorizedIds = stores
      .filter((store) => store.ownerId !== userId)
      .map((store) => store.id);

    if (unauthorizedIds.length > 0) {
      throw new UnauthorizedException(
        `Not authorized to access stores: ${unauthorizedIds.join(', ')}`
      );
    }
  }

  async validateBulkProductAccess(
    userId: string,
    productIds: string[]
  ): Promise<void> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        store: { select: { ownerId: true } },
      },
    });

    // Check if all products were found
    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      throw new UnauthorizedException(
        `Products not found: ${missingIds.join(', ')}`
      );
    }

    // Check if user has access to all products
    const unauthorizedIds = products
      .filter((product) => product.store.ownerId !== userId)
      .map((product) => product.id);

    if (unauthorizedIds.length > 0) {
      throw new UnauthorizedException(
        `Not authorized to access products: ${unauthorizedIds.join(', ')}`
      );
    }
  }

  async validateBulkCategoryAccess(
    userId: string,
    categoryIds: string[]
  ): Promise<void> {
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        store: { select: { ownerId: true } },
      },
    });

    if (categories.length !== categoryIds.length) {
      const foundIds = new Set(categories.map((category) => category.id));
      const missingIds = categoryIds.filter((id) => !foundIds.has(id));
      throw new UnauthorizedException(
        `Categories not found: ${missingIds.join(', ')}`
      );
    }

    const unauthorizedIds = categories
      .filter((category) => category.store.ownerId !== userId)
      .map((category) => category.id);

    if (unauthorizedIds.length > 0) {
      throw new UnauthorizedException(
        `Not authorized to access categories: ${unauthorizedIds.join(', ')}`
      );
    }
  }

  async validateBulkCollectionAccess(
    userId: string,
    collectionIds: string[]
  ): Promise<void> {
    const collections = await this.prisma.collection.findMany({
      where: { id: { in: collectionIds } },
      select: {
        id: true,
        store: { select: { ownerId: true } },
      },
    });

    if (collections.length !== collectionIds.length) {
      const foundIds = new Set(collections.map((collection) => collection.id));
      const missingIds = collectionIds.filter((id) => !foundIds.has(id));
      throw new UnauthorizedException(
        `Collections not found: ${missingIds.join(', ')}`
      );
    }

    const unauthorizedIds = collections
      .filter((collection) => collection.store.ownerId !== userId)
      .map((collection) => collection.id);

    if (unauthorizedIds.length > 0) {
      throw new UnauthorizedException(
        `Not authorized to access collections: ${unauthorizedIds.join(', ')}`
      );
    }
  }

  async validateBulkCustomerAccess(
    userId: string,
    customerIds: string[]
  ): Promise<void> {
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: {
        id: true,
        store: {
          select: { ownerId: true },
        },
      },
    });

    // Check if all customers were found
    if (customers.length !== customerIds.length) {
      const foundIds = new Set(customers.map((customer) => customer.id));
      const missingIds = customerIds.filter((id) => !foundIds.has(id));
      throw new UnauthorizedException(
        `Customers not found: ${missingIds.join(', ')}`
      );
    }

    // Check if user has access to all customers
    const unauthorizedIds = customers
      .filter((customer) => customer.store.ownerId !== userId)
      .map((customer) => customer.id);

    if (unauthorizedIds.length > 0) {
      throw new UnauthorizedException(
        `Not authorized to access customers: ${unauthorizedIds.join(', ')}`
      );
    }
  }
}
