import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class BulkCategoryOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const categoryIds = this.getCategoryIds(ctx);
    if (!categoryIds?.length) {
      throw new UnauthorizedException('Category IDs not provided');
    }

    await this.authService.validateBulkCategoryAccess(userId, categoryIds);
    return true;
  }

  private getCategoryIds(ctx: GqlExecutionContext): string[] {
    const args = ctx.getArgs();
    return args.categoryIds || args.input?.categoryIds || [];
  }
}
