import { User } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  UserCreateInput,
  UserUpdateInput,
  UserPasswordUpdateInput,
} from './user.dto';
import { PrismaService } from 'lib/admin-api/prisma/prisma.service';
import { PaginationArgs } from 'lib/admin-api/pagination/pagination.args';
import { paginate } from 'lib/admin-api/pagination/paginate';
import { comparePassword, hashPassword } from 'lib/admin-api/utils/hashing';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getUsers(args: PaginationArgs): Promise<User[]> {
    return paginate({ modelDelegate: this.prismaService.user, args });
  }

  async create(input: UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        language: input.language,
        timeZone: input.timeZone,
        theme: input.theme,
        passwordHash: input.password
          ? await hashPassword(input.password)
          : null,
      },
    });
  }

  async update(input: UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: { id: input.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        language: input.language,
        timeZone: input.timeZone,
        theme: input.theme,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { refreshTokenHash: await hashPassword(refreshToken) },
    });
  }

  async deleteRefreshToken(userId: string): Promise<boolean> {
    return !!(await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    }));
  }

  async updatePassword(input: UserPasswordUpdateInput): Promise<User> {
    const user = await this.getUserById(input.id);
    if (!user?.passwordHash) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!(await comparePassword(input.oldPassword, user.passwordHash))) {
      throw new BadRequestException('Invalid old password');
    }

    return this.prismaService.user.update({
      where: { id: input.id },
      data: {
        passwordHash: input.newPassword
          ? await hashPassword(input.newPassword)
          : null,
      },
    });
  }
}
