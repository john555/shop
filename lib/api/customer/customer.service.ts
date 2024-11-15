import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import { CustomerCreateInput, CustomerUpdateInput } from './customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    try {
      return await this.prismaService.customer.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  }

  async findByStoreId(
    storeId: string,
    args?: PaginationArgs
  ): Promise<Customer[]> {
    try {
      return await paginate({
        modelDelegate: this.prismaService.customer,
        args,
        where: { storeId },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching customers for store ${storeId}:`,
        error
      );
      throw error;
    }
  }

  async create(input: CustomerCreateInput): Promise<Customer> {
    try {
      return await this.prismaService.customer.create({
        data: {
          ...input,
          language: input.language,
          marketingEmails: input.marketingEmails || false,
          marketingSMS: input.marketingSMS || false,
        },
      });
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async update(id: string, input: CustomerUpdateInput): Promise<Customer> {
    try {
      return await this.prismaService.customer.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      this.logger.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Customer> {
    try {
      return await this.prismaService.customer.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }

  async validateStoreAccess(storeId: string, userId: string): Promise<boolean> {
    const store = await this.prismaService.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
    });
    return !!store;
  }
}
