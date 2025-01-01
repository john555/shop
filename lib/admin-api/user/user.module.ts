import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { StoreModule } from '../store/store.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [AuthorizationModule, StoreModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
