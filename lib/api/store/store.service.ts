import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Store,
  StoreCurrency,
  CurrencyPosition,
  StoreType,
  Prisma,
  AddressType,
  AddressOwnerType,
  User,
} from '@prisma/client';
import { PrismaService } from '@/api/prisma/prisma.service';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import { AddressService } from '../address/address.service';
import { AddressInput } from '../address/dto/address.dto';
import {
  StoreCreateData,
  StoreUpdateData,
  StoreInclude,
  DEFAULT_STORE_INCLUDE,
  StoreCurrencySettings,
} from './store.types';

const DEFAULT_CURRENCY_SYMBOLS: Record<StoreCurrency, string> = {
  KES: 'KSh',
  UGX: 'USh',
  TZS: 'TSh',
  RWF: 'RF',
  BIF: 'FBu',
  SSP: 'SSP',
};

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly addressService: AddressService
  ) {}

  // Currency Helper Methods
  getDefaultCurrencySymbol(currency: StoreCurrency): string {
    return DEFAULT_CURRENCY_SYMBOLS[currency];
  }

  getCurrencySymbol(store: Store): string {
    return store.currencySymbol ?? DEFAULT_CURRENCY_SYMBOLS[store.currency];
  }

  formatPrice(
    store: Store,
    amount: number,
    options?: {
      decimalPlaces?: number;
      showCurrencyCode?: boolean;
      useGrouping?: boolean;
    }
  ): string {
    const symbol = this.getCurrencySymbol(store);
    const decimalPlaces = options?.decimalPlaces ?? 2;
    const useGrouping = options?.useGrouping ?? true;
    const showCode = options?.showCurrencyCode ?? store.showCurrencyCode;

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping,
    }).format(amount);

    const currencyCode = showCode ? ` ${store.currency}` : '';

    return store.currencyPosition === CurrencyPosition.BEFORE_AMOUNT
      ? `${symbol}${formattedAmount}${currencyCode}`
      : `${formattedAmount}${symbol}${currencyCode}`;
  }

  // Query Methods
  async getStoreById(
    id: string,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store | null> {
    try {
      return this.prismaService.store.findUnique({
        where: { id },
        include,
      });
    } catch (error) {
      this.logger.error(`Error fetching store with ID ${id}:`, error);
      throw error;
    }
  }

  async getStoreBySlug(
    slug: string,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store | null> {
    try {
      return this.prismaService.store.findUnique({
        where: { slug },
        include,
      });
    } catch (error) {
      this.logger.error(`Error fetching store with slug ${slug}:`, error);
      throw error;
    }
  }

  async getStoresByOwnerId(
    ownerId: string,
    args?: PaginationArgs,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store[]> {
    try {
      const stores = await paginate({
        modelDelegate: this.prismaService.store,
        args,
        where: { ownerId },
        include,
      });

      return stores;
    } catch (error) {
      this.logger.error(`Error fetching stores for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async getStoresByType(
    type: StoreType,
    args?: PaginationArgs,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store[]> {
    try {
      const stores = await paginate({
        modelDelegate: this.prismaService.store,
        args,
        where: { type },
        include,
      });

      return stores;
    } catch (error) {
      this.logger.error(`Error fetching stores of type ${type}:`, error);
      throw error;
    }
  }

  // Mutation Methods
  async create(
    input: StoreCreateData,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store> {
    try {
      return this.prismaService.store.create({
        data: {
          ...input,
          currencySymbol:
            input.currencySymbol ?? DEFAULT_CURRENCY_SYMBOLS[input.currency],
          currencyPosition:
            input.currencyPosition ?? CurrencyPosition.BEFORE_AMOUNT,
          showCurrencyCode: input.showCurrencyCode ?? false,
          timeZone: input.timeZone ?? 'Africa/Nairobi',
          orderPrefix: input.orderPrefix ?? '#',
        },
        include,
      });
    } catch (error) {
      this.logger.error('Error creating store:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Store> {
    try {
      const store = await this.getStoreById(id);
      if (!store) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }

      // Use transaction to ensure all related data is deleted properly
      return await this.prismaService.$transaction(async (prisma) => {
        // Delete all store addresses
        await prisma.addressOnOwner.deleteMany({
          where: {
            ownerId: id,
            ownerType: AddressOwnerType.STORE,
          },
        });

        // Delete the store
        return prisma.store.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.logger.error(`Error deleting store ${id}:`, error);
      throw error;
    }
  }
  async update(
    id: string,
    input: StoreUpdateData,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store> {
    try {
      const store = await this.getStoreById(id);
      if (!store) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }

      const currencySymbol = input.currency
        ? input.currencySymbol ?? DEFAULT_CURRENCY_SYMBOLS[input.currency]
        : input.currencySymbol;

      const updateData: Prisma.StoreUpdateInput = {
        ...input,
        currency: input.currency ? { set: input.currency } : undefined,
        currencySymbol:
          currencySymbol !== undefined ? { set: currencySymbol } : undefined,
        currencyPosition: input.currencyPosition
          ? { set: input.currencyPosition }
          : undefined,
      };

      return this.prismaService.store.update({
        where: { id },
        data: updateData,
        include,
      });
    } catch (error) {
      this.logger.error(`Error updating store ${id}:`, error);
      throw error;
    }
  }

  async updateCurrencySettings(
    id: string,
    settings: StoreCurrencySettings,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store> {
    try {
      const store = await this.getStoreById(id);
      if (!store) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }

      const currencySymbol = settings.currency
        ? settings.currencySymbol ?? DEFAULT_CURRENCY_SYMBOLS[settings.currency]
        : settings.currencySymbol;

      const updateData: Prisma.StoreUpdateInput = {
        currency: settings.currency ? { set: settings.currency } : undefined,
        currencySymbol:
          currencySymbol !== undefined ? { set: currencySymbol } : undefined,
        currencyPosition: settings.currencyPosition
          ? { set: settings.currencyPosition }
          : undefined,
        showCurrencyCode:
          settings.showCurrencyCode !== undefined
            ? { set: settings.showCurrencyCode }
            : undefined,
      };

      return this.prismaService.store.update({
        where: { id },
        data: updateData,
        include,
      });
    } catch (error) {
      this.logger.error(
        `Error updating currency settings for store ${id}:`,
        error
      );
      throw error;
    }
  }

  // Address Methods
  async updateStoreAddress(
    storeId: string,
    type: AddressType,
    addressData: AddressInput,
    include: StoreInclude = DEFAULT_STORE_INCLUDE
  ): Promise<Store> {
    try {
      const store = await this.getStoreById(storeId);
      if (!store) {
        throw new NotFoundException(`Store with ID ${storeId} not found`);
      }

      await this.addressService.upsertOwnerAddress(
        storeId,
        AddressOwnerType.STORE,
        type,
        addressData
      );

      const updatedStore = await this.getStoreById(storeId, include);
      if (!updatedStore) {
        throw new NotFoundException(
          `Store with ID ${storeId} not found after address update`
        );
      }

      return  updatedStore;
    } catch (error) {
      this.logger.error(`Error updating address for store ${storeId}:`, error);
      throw error;
    }
  }

  async findStoreOwner(storeId: string): Promise<User> {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        stores: {
          some: {
            id: storeId,
          },
        },
      },
    });
  }

  // Validation Methods
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const existingStore = await this.prismaService.store.findFirst({
        where: {
          slug,
          id: excludeId ? { not: excludeId } : undefined,
        },
      });
      return !existingStore;
    } catch (error) {
      this.logger.error(`Error validating slug uniqueness for ${slug}:`, error);
      throw error;
    }
  }
}
