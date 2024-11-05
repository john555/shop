import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { 
  Store as StoreModel,
  StoreType, 
  StoreCurrency, 
  CurrencyPosition,
  UnitSystem,
  WeightUnit
} from '@prisma/client';
import { AddressOnOwner } from '../address/entities/address-owner.entity';
import { User } from '../user/user.entity';

// Register all enums for GraphQL
registerEnumType(StoreType, {
  name: 'StoreType',
  description: 'The type of store (PHYSICAL_GOODS, REAL_ESTATE, VEHICLES)',
});

registerEnumType(StoreCurrency, {
  name: 'StoreCurrency',
  description: 'The currency used by the store (KES, UGX, TZS, etc.)',
});

registerEnumType(CurrencyPosition, {
  name: 'CurrencyPosition',
  description: 'Position of currency symbol (BEFORE_AMOUNT, AFTER_AMOUNT)',
});

registerEnumType(UnitSystem, {
  name: 'UnitSystem',
  description: 'Measurement system used by the store (METRIC, IMPERIAL)',
});

registerEnumType(WeightUnit, {
  name: 'WeightUnit',
  description: 'Weight unit used by the store (KILOGRAM, POUND, etc.)',
});

@ObjectType({ description: 'Store model' })
export class Store implements Omit<StoreModel, 'addresses' | 'owner'> {
  @Field(() => ID, { description: 'Unique identifier of the store' })
  id: string;

  @Field(() => String, { description: 'Name of the store' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug of the store' })
  slug: string;

  // Contact Information
  @Field(() => String, { description: 'Email address of the store' })
  email: string;

  @Field(() => String, { 
    description: 'Phone number of the store',
    nullable: true 
  })
  phone: string | null;

  @Field(() => String, { 
    description: 'WhatsApp business number',
    nullable: true 
  })
  whatsApp: string | null;

  // Social Media
  @Field(() => String, { 
    description: 'Facebook page username/handle',
    nullable: true 
  })
  facebook: string | null;

  @Field(() => String, { 
    description: 'Instagram handle (without @)',
    nullable: true 
  })
  instagram: string | null;

  // Store Type
  @Field(() => StoreType, { description: 'Type of store' })
  type: StoreType;

  // Currency Settings
  @Field(() => StoreCurrency, { description: 'Primary currency of the store' })
  currency: StoreCurrency;

  @Field(() => String, { 
    description: 'Custom symbol for the currency (e.g., KSh, USh)',
    nullable: true 
  })
  currencySymbol: string | null;

  @Field(() => CurrencyPosition, { 
    description: 'Position of the currency symbol relative to the amount' 
  })
  currencyPosition: CurrencyPosition;

  @Field(() => Boolean, { 
    description: 'Whether to show currency code alongside amounts' 
  })
  showCurrencyCode: boolean;

  // Measurement Settings
  @Field(() => UnitSystem, { 
    description: 'Measurement system used by the store' 
  })
  unitSystem: UnitSystem;

  @Field(() => WeightUnit, { 
    description: 'Weight unit used for products' 
  })
  weightUnit: WeightUnit;

  @Field(() => String, { 
    description: 'Timezone of the store (e.g., Africa/Nairobi)' 
  })
  timeZone: string;

  // Order Configuration
  @Field(() => String, { 
    description: 'Prefix for order numbers',
    nullable: true 
  })
  orderPrefix: string | null;

  @Field(() => String, { 
    description: 'Suffix for order numbers',
    nullable: true 
  })
  orderSuffix: string | null;

  // Relations
  @Field(() => [AddressOnOwner], { 
    description: 'Addresses associated with the store',
    nullable: true 
  })
  addresses?: AddressOnOwner[];

  @Field(() => User, { 
    description: 'Owner of the store',
    nullable: true 
  })
  owner?: User;

  @Field(() => String, { description: 'ID of the store owner' })
  ownerId: string;

  // Timestamps
  @Field(() => Date, { description: 'When the store was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the store was last updated' })
  updatedAt: Date;
}