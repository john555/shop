import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class OrderOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const orderId = this.getOrderId(ctx);
    if (!orderId) {
      throw new UnauthorizedException('Order ID not provided');
    }

    const hasAccess = await this.authService.canAccessOrder(
      userId,
      orderId
    );
    if (!hasAccess) {
      throw new UnauthorizedException('Not authorized to access this order');
    }

    return true;
  }

  private getOrderId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return (
      args.orderId ||
      args.id ||
      args.input?.id ||
      args.input?.orderId ||
      undefined
    );
  }
}
