import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserCreateInput, UserUpdateInput } from './user.dto';
import { PaginationArgs } from 'lib/api/pagination/pagination.args';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
  async updateUser(@Args('input') input: UserUpdateInput): Promise<User | null> {
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
}
