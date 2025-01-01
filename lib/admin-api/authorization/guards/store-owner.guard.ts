import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Extract storeId from args
    const storeId = this.getStoreId(ctx);
    if (!storeId) {
      throw new UnauthorizedException('Store ID not provided');
    }

    const hasAccess = await this.authService.canAccessStore(userId, storeId);
    if (!hasAccess) {
      throw new UnauthorizedException('Not authorized to access this store');
    }

    return true;
  }

  private getStoreId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return (
      args.storeId ||
      args.input?.storeId ||
      args.id ||
      args.input?.id ||
      undefined
    );
  }
}
