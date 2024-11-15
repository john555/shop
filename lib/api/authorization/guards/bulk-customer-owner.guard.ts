import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class BulkCustomerOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const customerIds = this.getCustomerIds(ctx);
    if (!customerIds?.length) {
      throw new UnauthorizedException('Customer IDs not provided');
    }

    await this.authService.validateBulkCustomerAccess(userId, customerIds);
    return true;
  }

  private getCustomerIds(ctx: GqlExecutionContext): string[] {
    const args = ctx.getArgs();
    return args.customerIds || args.input?.customerIds || [];
  }
}
