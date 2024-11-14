import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  BadRequestException,
  Logger,
  NotFoundException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import {
  UserCreateInput,
  UserUpdateInput,
  UserPasswordUpdateInput,
} from './user.dto';
import { PaginationArgs } from 'lib/api/pagination/pagination.args';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { Store } from '../store/store.entity';
import { StoreService } from '../store/store.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { description: 'Get current user' })
  async me(@Context() context: any) {
    return this.userService.getUserById(context.req.user.id);
  }

  @UseGuards(JwtAuthGuard)
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

  @Query(() => [User!])
  async users(@Args() args: PaginationArgs): Promise<User[]> {
    return this.userService.getUsers(args);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: UserCreateInput): Promise<User> {
    return this.userService.create(input);
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
