// categories/real-estate.categories.ts

import { PresetCategory, CategoryCreator, createSlug } from '../category.types';

export class RealEstateCategories implements CategoryCreator {
  getCategories(): PresetCategory[] {
    return [
      {
        name: 'Residential Properties',
        slug: 'residential-properties',
        description: 'Properties for residential use',
        children: [
          {
            name: 'Apartments & Flats',
            slug: 'apartments-flats',
            description: 'Multi-unit residential buildings',
            children: [
              { name: 'Studio Apartments', slug: 'studio-apartments', description: 'Single-room living spaces' },
              { name: '1 Bedroom', slug: '1-bedroom-apartments', description: 'One bedroom apartments' },
              { name: '2 Bedrooms', slug: '2-bedroom-apartments', description: 'Two bedroom apartments' },
              { name: '3+ Bedrooms', slug: '3-plus-bedroom-apartments', description: 'Three or more bedroom apartments' },
              { name: 'Penthouses', slug: 'penthouses', description: 'Luxury top-floor apartments' },
              { name: 'Serviced Apartments', slug: 'serviced-apartments', description: 'Fully furnished serviced units' }
            ]
          },
          {
            name: 'Houses',
            slug: 'houses',
            description: 'Single-family homes',
            children: [
              { name: 'Bungalows', slug: 'bungalows', description: 'Single-story houses' },
              { name: 'Maisonettes', slug: 'maisonettes', description: 'Two-story houses' },
              { name: 'Villas', slug: 'villas', description: 'Luxury houses' },
              { name: 'Townhouses', slug: 'townhouses', description: 'Row houses' },
              { name: 'Cottages', slug: 'cottages', description: 'Small houses' },
              { name: 'Mansions', slug: 'mansions', description: 'Large luxury houses' }
            ]
          },
          // ... continue with more residential categories
        ]
      },
      // ... continue with more main categories
    ];
  }
}