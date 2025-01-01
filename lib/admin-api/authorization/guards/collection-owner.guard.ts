import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class CollectionOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const collectionId = this.getCollectionId(ctx);
    if (!collectionId) {
      throw new UnauthorizedException('Collection ID not provided');
    }

    const hasAccess = await this.authService.canAccessCollection(
      userId,
      collectionId
    );
    if (!hasAccess) {
      throw new UnauthorizedException(
        'Not authorized to access this collection'
      );
    }

    return true;
  }

  private getCollectionId(ctx: GqlExecutionContext): string | undefined {
    const args = ctx.getArgs();
    return args.collectionId || args.id || args.input?.id || undefined;
  }
}
