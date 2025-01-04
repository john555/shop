import { StoreType } from '@prisma/client';
import { PhysicalGoodsCategories } from './physical-goods.categories';
import { RealEstateCategories } from './real-estate.categories';
import { VehicleCategories } from './vehicle.categories';
import { CategoryCreator } from '../category.types';

export class CategoryFactory {
  static getCreator(storeType: StoreType): CategoryCreator {
    switch (storeType) {
      case StoreType.PHYSICAL_GOODS:
        return new PhysicalGoodsCategories();
      case StoreType.REAL_ESTATE:
        return new RealEstateCategories();
      case StoreType.VEHICLES:
        return new VehicleCategories();
      default:
        throw new Error(`Unsupported store type: ${storeType}`);
    }
  }
}
