import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'templateModule' })
export class TemplateModule {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  position: number;

  @Field(() => Date, {
    description: 'Date the TemplateModule was last updated',
  })
  updatedAt: Date;

  @Field(() => Date, { description: 'Date the TemplateModule was created' })
  createdAt: Date;
}
