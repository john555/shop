import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class BulkProductOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const productIds = this.getProductIds(ctx);
    if (!productIds?.length) {
      throw new UnauthorizedException('Product IDs not provided');
    }

    await this.authService.validateBulkProductAccess(userId, productIds);
    return true;
  }

  private getProductIds(ctx: GqlExecutionContext): string[] {
    const args = ctx.getArgs();
    return args.productIds || args.input?.productIds || [];
  }
}
