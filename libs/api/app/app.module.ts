import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from '@api/prisma/prisma.module';
import { AuthModule } from '@api/auth/auth.module';
import { UserModule } from '../user/user.module';
import { Request, Response } from 'express';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      playground:
        process.env.NODE_ENV! !== 'production'
          ? {
              settings: {
                'request.credentials': 'include',
              },
            }
          : false,
      autoSchemaFile: join(process.cwd(), 'types/api.schema.gql'),
      sortSchema: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
