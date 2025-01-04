import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TokenPayload } from '../authentication.dto';
import { type Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtCookieName: process.env.JWT_REFRESH_COOKIE_NAME,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        function (req: Request) {
          return req.signedCookies?.[process.env.JWT_REFRESH_COOKIE_NAME!];
        },
      ]),
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken =
      ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req) ||
      req.signedCookies?.[process.env.JWT_REFRESH_COOKIE_NAME!];

    if (!refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    return { ...payload, refreshToken };
  }
}
