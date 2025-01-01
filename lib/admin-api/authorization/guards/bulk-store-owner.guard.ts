import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class BulkStoreOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const storeIds = this.getStoreIds(ctx);
    if (!storeIds?.length) {
      throw new UnauthorizedException('Store IDs not provided');
    }

    await this.authService.validateBulkStoreAccess(userId, storeIds);
    return true;
  }

  private getStoreIds(ctx: GqlExecutionContext): string[] {
    const args = ctx.getArgs();
    return args.storeIds || args.input?.storeIds || [];
  }
}
