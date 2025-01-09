import { join } from 'path';
import { PrismaModule } from '@/lib/common/prisma/prisma.module';
import { HealthModule } from '@/lib/api/health/health.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductModule } from '../product/product.module';
import { AuthenticationModule } from '@/lib/common/backend/authentication/authentication.module';
import { AuthorizationModule } from '@/lib/common/backend/authorization/authorization.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
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
      autoSchemaFile: join(
        process.cwd(),
        'lib',
        'common',
        'types',
        'api.schema.gql'
      ),
      sortSchema: true,
    }),
    PrismaModule,
    HealthModule,
    AuthenticationModule,
    AuthorizationModule,
    ProductModule,
    CartModule,
  ],
})
export class AppModule {}
