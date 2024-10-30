import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, { name: 'SortOrder' });
@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  skip?: number;

  @Field(() => Int, { defaultValue: 25 })
  take?: number;

  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => SortOrder, { nullable: true })
  sortOrder?: string;
}
