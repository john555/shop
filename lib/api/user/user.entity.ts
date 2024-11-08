import { Language, Theme, User as UserBase } from '@prisma/client';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { Store } from '../store/store.entity';

// Register the Language enum for GraphQL
registerEnumType(Language, {
  name: 'Language',
  description: 'Supported user interface languages'
});

// Register the Theme enum for GraphQL
registerEnumType(Theme, {
  name: 'Theme',
  description: 'Available user interface themes'
});

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

  @Field(() => String, { 
    nullable: true, 
    description: 'Last name of the User' 
  })
  lastName: string | null;

  @Field(() => String, { 
    nullable: true, 
    description: 'URL of the User image' 
  })
  imageUrl: string | null;

  @Field(() => Boolean!, { 
    description: 'Whether the User email is verified' 
  })
  emailVerified: boolean;

  @Field(() => Language!, { 
    description: 'Preferred language for the user interface',
    defaultValue: Language.EN
  })
  language: Language;

  @Field(() => Theme!, { 
    description: 'Preferred theme for the user interface',
    defaultValue: Theme.SYSTEM
  })
  theme: Theme;

  @Field(() => String!, { 
    description: 'Preferred timezone',
    defaultValue: 'Africa/Nairobi'
  })
  timeZone: string;

  passwordHash: string | null;
  refreshTokenHash: string | null;

  @Field(() => [Store], { 
    description: 'Stores owned by the User'
  })
  stores?: Store;

  @Field(() => Date, {
    description: 'Date the User was last updated',
  })
  updatedAt: Date;

  @Field(() => Date, { 
    description: 'Date the User was created' 
  })
  createdAt: Date;
}
