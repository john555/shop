import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

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
}
