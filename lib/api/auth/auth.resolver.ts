import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthSignin, AuthSignout, AuthSignup } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthSigninInput, AuthSignupInput } from './auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';

@Resolver(() => AuthSignin)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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

  @Mutation(() => AuthSignup, { description: 'Sign up new user' })
  async signup(
    @Context() context: any,
    @Args('input') input: AuthSignupInput
  ): Promise<AuthSignin> {
    const result = await this.authService.signup(input);

    this.authService.setAuthCookies(context.res, result);

    return result;
  }
}
