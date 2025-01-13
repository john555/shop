import { Module } from '@nestjs/common';
import { OverviewResolver } from './overview.resolver';
import { OverviewService } from './overview.service';
import { StoreModule } from '@/lib/admin-api/store/store.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';

@Module({
  imports: [StoreModule, AuthorizationModule],
  providers: [OverviewResolver, OverviewService],
})
export class OverviewModule {}
