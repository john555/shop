import { Module, forwardRef } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { PrismaService } from '@/api/prisma/prisma.service';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [forwardRef(() =>StoreModule)],
  providers: [AddressService, AddressResolver, PrismaService],
  exports: [AddressService],
})
export class AddressModule {}