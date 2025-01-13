import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from '@/lib/common/prisma/prisma.module';
import { AuthenticationModule } from '@/common/backend/authentication/authentication.module';
import { UserModule } from '@/common/backend/user/user.module';
import { Request, Response } from 'express';
import { StoreModule } from '@/lib/admin-api/store/store.module';
import { MediaModule } from '@/lib/admin-api/media/media.module';
import { CategoryModule } from '@/lib/admin-api/category/category.module';
import { ProductModule } from '../product/product.module';
import { CollectionModule } from '@/lib/admin-api/collection/collection.module';
import { TagModule } from '@/lib/admin-api/tag/tag.module';
import { SlugModule } from '@/lib/admin-api/slug/slug.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';
import { CustomerModule } from '../customer/customer.module';
import { AddressOnOwnerModule } from '@/lib/admin-api/address-on-owner/address-on-owner.module';
import { OverviewModule } from '../overview/overview.module';
import { OrderModule } from '../order/order.module';
import { HealthModule } from '../health/health.module';
import { ConfigModule } from '@nestjs/config';

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
        'admin-api.schema.gql'
      ),
      sortSchema: true,
    }),
    PrismaModule,
    SlugModule,
    AuthenticationModule,
    AuthorizationModule,
    UserModule,
    StoreModule,
    MediaModule,
    CategoryModule,
    ProductModule,
    CollectionModule,
    TagModule,
    CustomerModule,
    AddressOnOwnerModule,
    OverviewModule,
    OrderModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
