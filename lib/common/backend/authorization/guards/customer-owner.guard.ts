import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class CustomerOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const customerId = this.getCustomerId(ctx);
    if (!customerId) {
      throw new UnauthorizedException('Customer ID not provided');
    }

    const hasAccess = await this.authService.canAccessCustomer(
      userId,
      customerId
    );
    if (!hasAccess) {
      throw new UnauthorizedException('Not authorized to access this customer');
    }

    return true;
  }

  private getCustomerId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return (
      args.customerId ||
      args.id ||
      args.input?.id ||
      args.input?.customerId ||
      undefined
    );
  }
}
