import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class CategoryOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const categoryId = this.getCategoryId(ctx);
    if (!categoryId) {
      throw new UnauthorizedException('Category ID not provided');
    }

    const hasAccess = await this.authService.canAccessCategory(
      userId,
      categoryId
    );
    if (!hasAccess) {
      throw new UnauthorizedException('Not authorized to access this category');
    }

    return true;
  }

  private getCategoryId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return args.categoryId || args.id || args.input?.id || undefined;
  }
}
