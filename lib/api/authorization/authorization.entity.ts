import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'authorization' })
export class Authorization {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  position: number;

  @Field(() => Date, {
    description: 'Date the Authorization was last updated',
  })
  updatedAt: Date;

  @Field(() => Date, { description: 'Date the Authorization was created' })
  createdAt: Date;
}
