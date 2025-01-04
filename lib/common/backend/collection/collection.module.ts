import { Module } from '@nestjs/common';
import { CollectionResolver } from './collection.resolver';
import { CollectionService } from './collection.service';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';

@Module({
  imports: [AuthorizationModule],
  providers: [CollectionResolver, CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
