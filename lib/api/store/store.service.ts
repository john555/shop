import { Prisma, Store } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import { GetMyStoresArgs } from './store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStoreById(id: string): Promise<Store | null> {
    return this.prismaService.store.findUnique({
      where: { id },
    });
  }

  async getStoresByOwnerId(
    ownerId: string,
    args?: PaginationArgs,
  ): Promise<Store[]> {
    return paginate({
      modelDelegate: this.prismaService.store,
      args,
      where: {
        ownerId,
      } as Prisma.StoreWhereInput,
    });
  }

  async create(input: Prisma.StoreUncheckedCreateInput): Promise<Store> {
    return this.prismaService.store.create({
      data: {
        ...input,
      },
    });
  }

  async update(
    id: string,
    input: Prisma.StoreUncheckedUpdateInput
  ): Promise<Store> {
    return this.prismaService.store.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }
}
