import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserUpdateInput, UserPasswordUpdateInput } from './user.dto';
import { Store } from '@/lib/admin-api/store/store.entity';
import { StoreService } from '@/lib/admin-api/store/store.service';
import { Auth } from '@/common/backend/authorization/decorators/auth.decorator';

@Auth()
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService
  ) {}

  @Query(() => User, { description: 'Get current user' })
  async me(@Context() context: any) {
    return this.userService.getUserById(context.req.user.id);
  }

  @ResolveField(() => [Store!])
  async stores(@Parent() user: User): Promise<Store[]> {
    return this.storeService.getStoresByOwnerId(user.id);
  }

  @Query(() => User!)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Args('input') input: UserUpdateInput
  ): Promise<User | null> {
    try {
      const user = await this.userService.update(input);
      if (!user) {
        throw new NotFoundException(`User with id=${input.id} not found`);
      }
      return user;
    } catch (e) {
      Logger.error(e);
      return null;
    }
  }

  @Mutation(() => User)
  async updatePassword(
    @Args('input') input: UserPasswordUpdateInput
  ): Promise<User | null> {
    try {
      const user = await this.userService.updatePassword(input);
      if (!user) {
        throw new NotFoundException(`User with id=${input.id} not found`);
      }
      return user;
    } catch (e) {
      Logger.error(e);
      throw e instanceof Error ? new BadRequestException(e.message) : e;
    }
  }
}
