// categories/vehicle.categories.ts

import { PresetCategory, CategoryCreator, createSlug } from '../category.types';

export class VehicleCategories implements CategoryCreator {
  getCategories(): PresetCategory[] {
    return [
      {
        name: 'Cars & Light Vehicles',
        slug: 'cars-light-vehicles',
        description: 'Personal and family vehicles',
        children: [
          {
            name: 'Sedans',
            slug: 'sedans',
            description: 'Four-door passenger cars',
            children: [
              { name: 'Compact Sedans', slug: 'compact-sedans', description: 'Small four-door cars' },
              { name: 'Mid-size Sedans', slug: 'mid-size-sedans', description: 'Medium-sized sedans' },
              { name: 'Full-size Sedans', slug: 'full-size-sedans', description: 'Large sedans' },
              { name: 'Luxury Sedans', slug: 'luxury-sedans', description: 'High-end sedans' },
              { name: 'Sports Sedans', slug: 'sports-sedans', description: 'Performance-oriented sedans' }
            ]
          },
          {
            name: 'SUVs & Crossovers',
            slug: 'suvs-crossovers',
            description: 'Sport utility vehicles',
            children: [
              { name: 'Compact SUVs', slug: 'compact-suvs', description: 'Small SUVs' },
              { name: 'Mid-size SUVs', slug: 'mid-size-suvs', description: 'Medium-sized SUVs' },
              { name: 'Full-size SUVs', slug: 'full-size-suvs', description: 'Large SUVs' },
              { name: 'Luxury SUVs', slug: 'luxury-suvs', description: 'High-end SUVs' },
              { name: 'Crossovers', slug: 'crossovers', description: 'Car-based SUVs' }
            ]
          },
          // ... continue with more vehicle categories
        ]
      },
      // ... continue with more main categories
    ];
  }
}