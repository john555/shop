import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TokenPayload } from '../authentication.dto';
import { Request } from 'express';
import { PrismaService } from '@/lib/admin-api/prisma/prisma.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
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
    return this.prismaService.user.findUniqueOrThrow({where: {id: payload.id}});
  }
}
