import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthSignin, AuthSignout } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthSigninInput } from './auth.dto';
import { User } from '@api/user/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';

@Resolver(() => AuthSignin)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { description: 'Get current user' })
  async me(@Context() context: any) {
    return this.authService.me(context.req.user.id);
  }

  @Mutation(() => AuthSignin, { description: 'Sign in' })
  async signin(
    @Context() context: any,
    @Args('input') input: AuthSigninInput
  ): Promise<AuthSignin> {
    const result = await this.authService.signin(input);

    this.authService.setAuthCookies(context.res, result);

    return result;
  }

  @UseGuards(JwtRefreshGuard)
  @Mutation(() => AuthSignin, { description: 'Refresh auth token' })
  async refresh(@Context() context: any): Promise<AuthSignin> {
    const result = await this.authService.refresh(
      context.req.user.refreshToken,
      context.req.user.id
    );

    this.authService.setAuthCookies(context.res, result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthSignout, { description: 'Sign out' })
  async signout(@Context() context: any): Promise<AuthSignout> {
    context.res.clearCookie(process.env.JWT_AUTH_COOKIE_NAME!);
    context.res.clearCookie(process.env.JWT_REFRESH_COOKIE_NAME!);

    return {
      success: true,
    };
  }
}
