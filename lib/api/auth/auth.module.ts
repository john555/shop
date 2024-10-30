import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'lib/api/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET!,
      signOptions: { expiresIn: `${process.env.JWT_AUTH_EXPIRES_MS!}ms` },
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtRefreshStrategy, JwtAuthStrategy],
})
export class AuthModule {}
