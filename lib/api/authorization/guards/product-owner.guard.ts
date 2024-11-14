import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class ProductOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const productId = this.getProductId(ctx);
    if (!productId) {
      throw new UnauthorizedException('Product ID not provided');
    }

    const hasAccess = await this.authService.canAccessProduct(
      userId,
      productId
    );
    if (!hasAccess) {
      throw new UnauthorizedException('Not authorized to access this product');
    }

    return true;
  }

  private getProductId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return args.productId || args.id || args.input?.id || undefined;
  }
}
