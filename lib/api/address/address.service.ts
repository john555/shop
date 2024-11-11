import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import {
  Address,
  AddressOnOwner,
  AddressOwnerType,
  AddressType,
  Prisma,
  User,
} from '@prisma/client';
import { AddressInput } from './dto/address.dto';

type AddressWithOwner = AddressOnOwner & { address: Address };

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Query Methods
  async findById(id: string): Promise<Address | null> {
    try {
      return await this.prismaService.address.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error finding address by ID ${id}:`, error);
      throw error;
    }
  }

  async findOwnerAddress(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType
  ): Promise<AddressWithOwner | null> {
    try {
      return await this.prismaService.addressOnOwner.findFirst({
        where: {
          ownerId,
          ownerType,
          type,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error finding address for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async findOwnerAddresses(
    ownerId: string,
    ownerType: AddressOwnerType
  ): Promise<AddressWithOwner[]> {
    try {
      return await this.prismaService.addressOnOwner.findMany({
        where: {
          ownerId,
          ownerType,
        },
        include: {
          address: true,
        },
        orderBy: {
          isDefault: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Error finding addresses for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async findDefaultAddress(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType
  ): Promise<AddressWithOwner | null> {
    try {
      return await this.prismaService.addressOnOwner.findFirst({
        where: {
          ownerId,
          ownerType,
          type,
          isDefault: true,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error finding default address for owner ${ownerId}:`,
        error
      );
      throw error;
    }
  }

  // Mutation Methods
  async upsertOwnerAddress(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType,
    addressData: AddressInput,
    isDefault: boolean = false
  ): Promise<AddressWithOwner> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        // Find existing address relationship
        const existingAddressOwner = await prisma.addressOnOwner.findFirst({
          where: {
            ownerId,
            ownerType,
            type,
          },
          include: {
            address: true,
          },
        });

        // If making this address default, remove default from other addresses of same type
        if (isDefault) {
          await prisma.addressOnOwner.updateMany({
            where: {
              ownerId,
              ownerType,
              type,
              isDefault: true,
            },
            data: {
              isDefault: false,
            },
          });
        }

        if (existingAddressOwner) {
          // Update existing address
          await prisma.address.update({
            where: { id: existingAddressOwner.addressId },
            data: addressData,
          });

          // Update relationship if isDefault changed
          if (existingAddressOwner.isDefault !== isDefault) {
            await prisma.addressOnOwner.update({
              where: { id: existingAddressOwner.id },
              data: { isDefault },
            });
          }

          return prisma.addressOnOwner.findUniqueOrThrow({
            where: { id: existingAddressOwner.id },
            include: { address: true },
          });
        } else {
          // Create new address
          const address = await prisma.address.create({
            data: addressData,
          });

          // Create new relationship
          return prisma.addressOnOwner.create({
            data: {
              addressId: address.id,
              ownerId,
              ownerType,
              type,
              isDefault:
                isDefault ||
                (await this.isFirstAddressOfType(ownerId, ownerType, type)),
            },
            include: {
              address: true,
            },
          });
        }
      });
    } catch (error) {
      this.logger.error(`Error upserting address for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async deleteOwnerAddress(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType
  ): Promise<boolean> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const addressOwner = await prisma.addressOnOwner.findFirst({
          where: {
            ownerId,
            ownerType,
            type,
          },
        });

        if (!addressOwner) {
          return false;
        }

        // Delete the relationship
        await prisma.addressOnOwner.delete({
          where: { id: addressOwner.id },
        });

        // Check if the address is used by other owners
        const otherOwners = await prisma.addressOnOwner.count({
          where: {
            addressId: addressOwner.addressId,
          },
        });

        // If no other owners use this address, delete it
        if (otherOwners === 0) {
          await prisma.address.delete({
            where: { id: addressOwner.addressId },
          });
        }

        return true;
      });
    } catch (error) {
      this.logger.error(`Error deleting address for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async setDefaultAddress(
    ownerId: string,
    ownerType: AddressOwnerType,
    addressOwnerId: string
  ): Promise<AddressWithOwner> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        // Get the address relationship
        const addressOwner = await prisma.addressOnOwner.findUnique({
          where: { id: addressOwnerId },
        });

        if (!addressOwner) {
          throw new NotFoundException('Address relationship not found');
        }

        // Remove default from other addresses of same type
        await prisma.addressOnOwner.updateMany({
          where: {
            ownerId,
            ownerType,
            type: addressOwner.type,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });

        // Set this address as default
        return prisma.addressOnOwner.update({
          where: { id: addressOwnerId },
          data: { isDefault: true },
          include: { address: true },
        });
      });
    } catch (error) {
      this.logger.error(
        `Error setting default address for owner ${ownerId}:`,
        error
      );
      throw error;
    }
  }

  // Helper Methods
  private async isFirstAddressOfType(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType
  ): Promise<boolean> {
    const count = await this.prismaService.addressOnOwner.count({
      where: {
        ownerId,
        ownerType,
        type,
      },
    });
    return count === 0;
  }

  formatAddress(address: Address): string {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);

    return parts.join(', ');
  }
}
