import { StoreType } from '@prisma/client';
import { CategoryCreator, PresetCategory } from '../category.types';
import { PhysicalGoodsCategories } from './physical-goods.categories';
import { RealEstateCategories } from './real-estate.categories';
import { VehicleCategories } from './vehicle.categories';

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

export const createStoreCategories = async (
  prisma: any,
  storeId: string,
  storeType: StoreType
): Promise<void> => {
  const creator = CategoryFactory.getCreator(storeType);
  const categories = creator.getCategories();
  
  const createCategoryAndChildren = async (
    category: PresetCategory,
    parentId?: string
  ): Promise<void> => {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        store: { connect: { id: storeId } },
        ...(parentId && { parent: { connect: { id: parentId } } })
      }
    });

    if (category.children) {
      for (const child of category.children) {
        await createCategoryAndChildren(child, created.id);
      }
    }
  };

  for (const category of categories) {
    await createCategoryAndChildren(category);
  }
};