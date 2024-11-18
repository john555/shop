import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import {
  CustomerGetArgs,
  CustomerCreateInput,
  CustomerUpdateInput,
} from './customer.dto';
import { AuthContext } from '../utils/auth';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { AddressOnOwner } from '../address-on-owner/address-on-owner.entity';
import { AddressOnOwnerService } from '../address-on-owner/address-on-owner.service';
import { AddressOwnerType, AddressType } from '@prisma/client';

@Resolver(() => Customer)
export class CustomerResolver {
  private readonly logger = new Logger(CustomerResolver.name);

  constructor(
    private readonly customerService: CustomerService,
    private readonly addressOnOwnerService: AddressOnOwnerService
  ) {}

  private async validateStoreAccess(
    storeId: string,
    userId: string
  ): Promise<void> {
    const hasAccess = await this.customerService.validateStoreAccess(
      storeId,
      userId
    );
    if (!hasAccess) {
      throw new UnauthorizedException(
        "You do not have permission to access this store's customers"
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Customer)
  async customer(
    @Args() args: CustomerGetArgs,
    @Context() context: AuthContext
  ): Promise<Customer> {
    const customer = await this.customerService.findById(args.id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${args.id} not found`);
    }

    await this.validateStoreAccess(customer.storeId, context.req.user.id);
    return customer;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Customer])
  async storeCustomers(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Customer[]> {
    await this.validateStoreAccess(storeId, context.req.user.id);
    return this.customerService.findByStoreId(storeId, args);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Customer)
  async createCustomer(
    @Args('input') input: CustomerCreateInput,
    @Context() context: AuthContext
  ): Promise<Customer> {
    await this.validateStoreAccess(input.storeId, context.req.user.id);

    try {
      return await this.customerService.create(input);
    } catch (error) {
      this.logger.error('Failed to create customer:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Customer)
  async updateCustomer(
    @Args('input') input: CustomerUpdateInput,
    @Context() context: AuthContext
  ): Promise<Customer> {
    const customer = await this.customerService.findById(input.id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${input.id} not found`);
    }

    await this.validateStoreAccess(customer.storeId, context.req.user.id);

    try {
      return await this.customerService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update customer ${input.id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteCustomer(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<boolean> {
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.validateStoreAccess(customer.storeId, context.req.user.id);

    try {
      await this.customerService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete customer ${id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => AddressOnOwner, { nullable: true })
  async billingAddress(
    @Parent() customer: Customer
  ): Promise<AddressOnOwner | null> {
    const addresses = await this.addressOnOwnerService.findOwnerAddresses(
      customer.id,
      AddressOwnerType.CUSTOMER
    );
    return addresses.find((addr) => addr.type === AddressType.BILLING) || null;
  }
}
