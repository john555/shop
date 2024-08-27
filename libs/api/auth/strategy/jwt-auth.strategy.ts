import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TokenPayload } from '../auth.dto';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_AUTH_SECRET,
      jwtCookieName: process.env.JWT_AUTH_COOKIE_NAME,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        function (req: Request) {
          return req.signedCookies?.[process.env.JWT_AUTH_COOKIE_NAME!];
        },
      ]),
    });
  }

  async validate(payload: TokenPayload) {
    return payload;
  }
}
