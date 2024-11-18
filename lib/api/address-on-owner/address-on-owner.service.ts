import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import {
  AddressOnOwner,
  Address,
  AddressOwnerType,
  AddressType,
} from '@prisma/client';
import {
  AddressOnOwnerCreateInput,
  AddressOnOwnerUpdateInput,
} from './address-on-owner.dto';

@Injectable()
export class AddressOnOwnerService {
  private readonly logger = new Logger(AddressOnOwnerService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<AddressOnOwner | null> {
    try {
      return this.prismaService.addressOnOwner.findUnique({
        where: { id },
        include: { address: true },
      });
    } catch (error) {
      this.logger.error(`Error fetching AddressOnOwner with ID ${id}:`, error);
      throw error;
    }
  }

  async create(input: AddressOnOwnerCreateInput): Promise<AddressOnOwner> {
    try {
      const { address, ...addressOnOwnerData } = input;

      return await this.prismaService.addressOnOwner.create({
        data: {
          ...addressOnOwnerData,
          address: {
            create: address,
          },
        },
        include: { address: true },
      });
    } catch (error) {
      this.logger.error('Error creating AddressOnOwner:', error);
      throw error;
    }
  }

  async update(
    id: string,
    input: AddressOnOwnerUpdateInput
  ): Promise<AddressOnOwner> {
    try {
      const { address, ...addressOnOwnerData } = input;
      const existingAddressOnOwner = await this.findById(id);

      if (!existingAddressOnOwner) {
        throw new NotFoundException(`AddressOnOwner with ID ${id} not found`);
      }

      return await this.prismaService.addressOnOwner.update({
        where: { id },
        data: {
          ...addressOnOwnerData,
          ...(address && {
            address: {
              update: address,
            },
          }),
        },
        include: { address: true },
      });
    } catch (error) {
      this.logger.error(`Error updating AddressOnOwner ${id}:`, error);
      throw error;
    }
  }

  async upsert(
    ownerId: string,
    ownerType: AddressOwnerType,
    type: AddressType,
    input: AddressOnOwnerCreateInput
  ): Promise<AddressOnOwner> {
    try {
      const existingAddress = await this.prismaService.addressOnOwner.findFirst(
        {
          where: {
            ownerId,
            ownerType,
            type,
          },
          include: { address: true },
        }
      );

      if (existingAddress) {
        return this.update(existingAddress.id, {
          id: existingAddress.id,
          type,
          isDefault: input.isDefault,
          address: input.address,
        });
      }

      return this.create(input);
    } catch (error) {
      this.logger.error(`Error upserting address for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const addressOnOwner = await this.findById(id);
      if (!addressOnOwner) {
        throw new NotFoundException(`AddressOnOwner with ID ${id} not found`);
      }

      await this.prismaService.addressOnOwner.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting AddressOnOwner ${id}:`, error);
      throw error;
    }
  }

  async getAddress(addressOnOwnerId: string): Promise<Address> {
    try {
      const result = await this.prismaService.addressOnOwner.findUnique({
        where: { id: addressOnOwnerId },
        include: { address: true },
      });
      if (!result?.address) {
        throw new NotFoundException(
          `Address not found for AddressOnOwner ${addressOnOwnerId}`
        );
      }
      return result.address;
    } catch (error) {
      this.logger.error(
        `Error fetching address for AddressOnOwner ${addressOnOwnerId}:`,
        error
      );
      throw error;
    }
  }

  async findOwnerAddresses(
    ownerId: string,
    ownerType: AddressOwnerType
  ): Promise<AddressOnOwner[]> {
    try {
      return this.prismaService.addressOnOwner.findMany({
        where: {
          ownerId,
          ownerType,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching addresses for owner ${ownerId}:`,
        error
      );
      throw error;
    }
  }
}
