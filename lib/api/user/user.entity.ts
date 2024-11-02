import { User as UserBase } from '@prisma/client';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { Store } from '../store/store.entity';

@Injectable()
@ObjectType({ description: 'user' })
export class User implements UserBase {
  @Field(() => ID!, { description: 'ID of the User' })
  id: string;

  @Field(() => String!, { description: 'Email of the User' })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'First name of the User',
  })
  firstName: string | null;

  @Field(() => String, { nullable: true, description: 'Last name of the User' })
  lastName: string | null;

  @Field(() => String, { nullable: true, description: 'URL of the User image' })
  imageUrl: string | null;

  @Field(() => Boolean!, { description: 'Whether the User email is verified' })
  emailVerified: boolean;

  passwordHash: string | null;
  refreshTokenHash: string | null;

  @Field(() => [Store], { description: 'Stores owned by the User'})
  stores?: Store

  @Field(() => Date, {
    description: 'Date the User was last updated',
  })
  updatedAt: Date;

  @Field(() => Date, { description: 'Date the User was created' })
  createdAt: Date;
}
