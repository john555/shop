import { Args, Query, Resolver } from '@nestjs/graphql';
import { StoreOverview } from './overview.entity';
import { OverviewService } from './overview.service';
import { AuthStore } from '@/common/backend/authorization/decorators/auth.decorator';

@Resolver(() => StoreOverview)
export class OverviewResolver {
  constructor(private readonly overviewService: OverviewService) {}

  @AuthStore()
  @Query(() => StoreOverview)
  async storeOverview(
    @Args('storeId') storeId: string,
  ): Promise<StoreOverview> {
    return this.overviewService.getStoreOverview(storeId);
  }
}