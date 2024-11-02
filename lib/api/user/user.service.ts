import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from './user.dto';
import { PrismaService } from 'lib/api/prisma/prisma.service';
import { PaginationArgs } from 'lib/api/pagination/pagination.args';
import { paginate } from 'lib/api/pagination/paginate';
import { hashPassword } from 'lib/api/utils/hashing';

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
        imageUrl: input.imageUrl,
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
        imageUrl: input.imageUrl,
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
}
