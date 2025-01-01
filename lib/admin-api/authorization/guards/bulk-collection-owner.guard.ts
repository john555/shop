import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class BulkCollectionOwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const collectionIds = this.getCollectionIds(ctx);
    if (!collectionIds?.length) {
      throw new UnauthorizedException('Collection IDs not provided');
    }

    await this.authService.validateBulkCollectionAccess(userId, collectionIds);
    return true;
  }

  private getCollectionIds(ctx: GqlExecutionContext): string[] {
    const args = ctx.getArgs();
    return args.collectionIds || args.input?.collectionIds || [];
  }
}
