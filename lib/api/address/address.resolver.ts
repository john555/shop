import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { StoreService } from '../store/store.service';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { Address } from './entities/address.entity';
import { AddressOnOwner } from './entities/address-owner.entity';
import {
  UpdateAddressInput,
  GetAddressesArgs,
  GetAddressArgs,
} from './dto/address.dto';
import { AuthContext } from '../utils/auth';
import { AddressOwnerType } from '@prisma/client';

@Resolver(() => Address)
export class AddressResolver {
  private readonly logger = new Logger(AddressResolver.name);

  constructor(
    private readonly addressService: AddressService,
    private readonly storeService: StoreService
  ) {}

  private async validateOwnership(
    ownerId: string,
    ownerType: AddressOwnerType,
    userId: string
  ): Promise<void> {
    switch (ownerType) {
      case AddressOwnerType.STORE:
        const store = await this.storeService.getStoreById(ownerId);
        if (!store) {
          throw new NotFoundException(`Store with ID ${ownerId} not found`);
        }
        if (store.ownerId !== userId) {
          throw new UnauthorizedException(
            'You do not have permission to access this address'
          );
        }
        break;

      case AddressOwnerType.CUSTOMER:
        if (ownerId !== userId) {
          throw new UnauthorizedException(
            'You can only access your own addresses'
          );
        }
        break;

      case AddressOwnerType.ORDER:
        throw new UnauthorizedException(
          'Order addresses cannot be modified directly'
        );

      default:
        throw new UnauthorizedException('Invalid owner type');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [AddressOnOwner])
  async getAddresses(
    @Args() args: GetAddressesArgs,
    @Context() context: AuthContext
  ): Promise<AddressOnOwner[]> {
    try {
      await this.validateOwnership(
        args.ownerId,
        args.ownerType,
        context.req.user.id
      );
      return this.addressService.findOwnerAddresses(
        args.ownerId,
        args.ownerType
      );
    } catch (error) {
      this.logger.error('Failed to fetch addresses:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AddressOnOwner, { nullable: true })
  async getAddress(
    @Args() args: GetAddressArgs,
    @Context() context: AuthContext
  ): Promise<AddressOnOwner | null> {
    try {
      await this.validateOwnership(
        args.ownerId,
        args.ownerType,
        context.req.user.id
      );
      return this.addressService.findOwnerAddress(
        args.ownerId,
        args.ownerType,
        args.type
      );
    } catch (error) {
      this.logger.error('Failed to fetch address:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AddressOnOwner)
  async updateAddress(
    @Args('input') input: UpdateAddressInput,
    @Context() context: AuthContext
  ): Promise<AddressOnOwner> {
    try {
      await this.validateOwnership(
        input.ownerId,
        input.ownerType,
        context.req.user.id
      );

      return this.addressService.upsertOwnerAddress(
        input.ownerId,
        input.ownerType,
        input.type,
        input.address,
        input.isDefault
      );
    } catch (error) {
      this.logger.error('Failed to update address:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteAddress(
    @Args() args: GetAddressArgs,
    @Context() context: AuthContext
  ): Promise<boolean> {
    try {
      await this.validateOwnership(
        args.ownerId,
        args.ownerType,
        context.req.user.id
      );
      return this.addressService.deleteOwnerAddress(
        args.ownerId,
        args.ownerType,
        args.type
      );
    } catch (error) {
      this.logger.error('Failed to delete address:', error);
      throw error;
    }
  }
}
