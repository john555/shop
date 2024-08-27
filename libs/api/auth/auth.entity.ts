import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@api/user/user.entity';

@ObjectType({ description: 'AuthSignin' })
export class AuthSignin {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType({ description: 'AuthSignout' })
export class AuthSignout {
  @Field(() => Boolean)
  success: boolean;
}

@ObjectType({ description: 'AuthCurrentUser' })
export class AuthCurrentUser {
  @Field(() => User)
  user: User;
}
