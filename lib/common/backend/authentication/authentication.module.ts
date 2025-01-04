import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationResolver } from './authentication.resolver';
import { UserModule } from '@/common/backend/user/user.module';
import { AuthenticationService } from './authentication.service';
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
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    JwtRefreshStrategy,
    JwtAuthStrategy,
  ],
})
export class AuthenticationModule {}
