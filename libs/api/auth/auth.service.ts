import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthSigninInput, AuthSignupInput, TokenPayload } from './auth.dto';
import { AuthSignin, AuthSignup } from './auth.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@api/user/user.service';
import { comparePassword } from '@api/utils/hashing';
import { User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async me(userId: string) {
    return this.userService.getUserById(userId);
  }

  async signin(input: AuthSigninInput): Promise<AuthSignin> {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user?.passwordHash) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!(await comparePassword(input.password, user.passwordHash))) {
      throw new BadRequestException('Invalid email or password');
    }

    const result = await this.createTokensForUser(user);
    await this.userService.updateRefreshToken(user.id, result.refreshToken);
    return result;
  }

  async signout(userId: string): Promise<boolean> {
    return this.userService.deleteRefreshToken(userId);
  }

  async refresh(refreshToken: string, userId: string): Promise<AuthSignin> {
    const user = await this.userService.getUserById(userId);
    if (!user?.refreshTokenHash) {
      throw new BadRequestException('Invalid user');
    }

    if (!(await comparePassword(refreshToken, user.refreshTokenHash))) {
      throw new BadRequestException('Invalid refresh token');
    }

    const result = await this.createTokensForUser(user);
    await this.userService.updateRefreshToken(user.id, result.refreshToken);
    return result;
  }

  async signup(input: AuthSignupInput): Promise<AuthSignup> {
    const existingUser = await this.userService.getUserByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.create({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const result = await this.createTokensForUser(user);
    await this.userService.updateRefreshToken(user.id, result.refreshToken);
    return result;
  }

  private async createTokensForUser(user: User): Promise<AuthSignin> {
    const payload = { id: user.id } satisfies TokenPayload;

    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_MS,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      refreshToken,
      accessToken: await this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_AUTH_EXPIRES_MS,
        secret: process.env.JWT_AUTH_SECRET,
      }),
    };
  }

  setAuthCookies(res: Response, tokens: AuthSignin) {
    res.cookie(process.env.JWT_AUTH_COOKIE_NAME!, tokens.accessToken, {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.COOKIE_DOMAIN,
      expires: new Date(Date.now() + parseInt(process.env.JWT_AUTH_EXPIRES_MS!)),
    });

    res.cookie(process.env.JWT_REFRESH_COOKIE_NAME!, tokens.refreshToken, {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.COOKIE_DOMAIN,
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_MS!),
      ),
    });
  }
}
