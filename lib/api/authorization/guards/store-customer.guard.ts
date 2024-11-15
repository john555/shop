import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { GqlExecutionContext } from '@nestjs/graphql';
  import { AuthorizationService } from '../authorization.service';
  
@Injectable()
export class StoreCustomerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const storeId = this.getStoreId(ctx);
    if (!storeId) {
      throw new UnauthorizedException('Store ID not provided');
    }

    // Verify the user owns the store before allowing customer operations
    const hasAccess = await this.authService.canAccessStore(userId, storeId);
    if (!hasAccess) {
      throw new UnauthorizedException(
        'Not authorized to access customers for this store'
      );
    }

    return true;
  }

  private getStoreId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return args.storeId || args.input?.storeId || undefined;
  }
}
