import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
