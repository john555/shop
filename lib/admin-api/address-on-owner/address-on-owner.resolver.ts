import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, NotFoundException } from '@nestjs/common';
import { AddressOnOwner, Address } from './address-on-owner.entity';
import { AddressOnOwnerService } from './address-on-owner.service';
import {
  AddressOnOwnerGetArgs,
  GetOwnerAddressesArgs,
  AddressOnOwnerCreateInput,
  AddressOnOwnerUpdateInput,
} from './address-on-owner.dto';
import { Auth } from '../authorization/decorators/auth.decorator';

@Resolver(() => AddressOnOwner)
export class AddressOnOwnerResolver {
  private readonly logger = new Logger(AddressOnOwnerResolver.name);

  constructor(private readonly addressOnOwnerService: AddressOnOwnerService) {}

  @Auth()
  @Query(() => AddressOnOwner)
  async addressOnOwner(
    @Args() args: AddressOnOwnerGetArgs,
    
  ): Promise<AddressOnOwner> {
    const addressOnOwner = await this.addressOnOwnerService.findById(args.id);
    if (!addressOnOwner) {
      throw new NotFoundException(
        `AddressOnOwner with ID ${args.id} not found`
      );
    }
    return addressOnOwner;
  }

  @Auth()
  @Query(() => [AddressOnOwner])
  async ownerAddresses(
    @Args() args: GetOwnerAddressesArgs
  ): Promise<AddressOnOwner[]> {
    return this.addressOnOwnerService.findOwnerAddresses(
      args.ownerId,
      args.ownerType
    );
  }

  @Auth()
  @Mutation(() => AddressOnOwner)
  async createAddressOnOwner(
    @Args('input') input: AddressOnOwnerCreateInput,
    
  ): Promise<AddressOnOwner> {
    return this.addressOnOwnerService.create(input);
  }

  @Auth()
  @Mutation(() => AddressOnOwner)
  async updateAddressOnOwner(
    @Args('input') input: AddressOnOwnerUpdateInput,
    
  ): Promise<AddressOnOwner> {
    return this.addressOnOwnerService.update(input.id, input);
  }

  @Auth()
  @Mutation(() => Boolean)
  async deleteAddressOnOwner(
    @Args('id') id: string,
    
  ): Promise<boolean> {
    await this.addressOnOwnerService.delete(id);
    return true;
  }

  @ResolveField(() => Address)
  async address(@Parent() addressOnOwner: AddressOnOwner): Promise<Address> {
    return this.addressOnOwnerService.getAddress(addressOnOwner.id);
  }
}
