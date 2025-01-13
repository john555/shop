import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { StoreModule } from '@/lib/admin-api/store/store.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';

@Module({
  imports: [AuthorizationModule, StoreModule],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
