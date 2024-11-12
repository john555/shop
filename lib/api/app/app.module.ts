import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from 'lib/api/prisma/prisma.module';
import { AuthModule } from 'lib/api/auth/auth.module';
import { UserModule } from '../user/user.module';
import { Request, Response } from 'express';
import { StoreModule } from '../store/store.module';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { CollectionModule } from '../collection/collection.module';
import { TagModule } from '../tag/tag.module';
import { SlugModule } from '../slug/slug.module';

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
    SlugModule,
    AuthModule,
    UserModule,
    StoreModule,
    MediaModule,
    CategoryModule,
    ProductModule,
    CollectionModule,
    TagModule,
  ],
  providers: [],
})
export class AppModule {}
