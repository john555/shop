import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { StoreModule } from '@/lib/admin-api/store/store.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';

@Module({
  imports: [AuthorizationModule, StoreModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
