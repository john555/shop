import { PresetCategory, CategoryCreator } from '../category.types';

export class RealEstateCategories implements CategoryCreator {
  getCategories(): PresetCategory[] {
    return [
      {
        name: 'Residential Properties',
        slug: 'residential-properties',
        description: 'Properties for living purposes',
        children: [
          {
            name: 'Apartments & Flats',
            slug: 'apartments-flats',
            description: 'Multi-unit residential buildings',
            children: [
              {
                name: 'Studio Apartments',
                slug: 'studio-apartments',
                description: 'Single-room living spaces',
              },
              {
                name: '1 Bedroom Apartments',
                slug: '1-bedroom-apartments',
                description: 'One-bedroom units',
              },
              {
                name: '2 Bedroom Apartments',
                slug: '2-bedroom-apartments',
                description: 'Two-bedroom units',
              },
              {
                name: '3+ Bedroom Apartments',
                slug: '3-plus-bedroom-apartments',
                description: 'Three or more bedrooms',
              },
              {
                name: 'Penthouses',
                slug: 'penthouses',
                description: 'Top-floor luxury apartments',
              },
              {
                name: 'Lofts',
                slug: 'lofts',
                description: 'Open-plan apartments',
              },
              {
                name: 'Duplexes',
                slug: 'duplexes',
                description: 'Two-story apartments',
              },
              {
                name: 'Serviced Apartments',
                slug: 'serviced-apartments',
                description: 'Managed residential units',
              },
            ],
          },
          {
            name: 'Houses',
            slug: 'houses',
            description: 'Single-family homes',
            children: [
              {
                name: 'Detached Houses',
                slug: 'detached-houses',
                description: 'Standalone homes',
              },
              {
                name: 'Semi-Detached Houses',
                slug: 'semi-detached-houses',
                description: 'Paired homes',
              },
              {
                name: 'Townhouses',
                slug: 'townhouses',
                description: 'Row houses',
              },
              {
                name: 'Bungalows',
                slug: 'bungalows',
                description: 'Single-story homes',
              },
              {
                name: 'Maisonettes',
                slug: 'maisonettes',
                description: 'Two-story homes',
              },
              {
                name: 'Villas',
                slug: 'villas',
                description: 'Luxury standalone homes',
              },
              {
                name: 'Cottages',
                slug: 'cottages',
                description: 'Small country homes',
              },
              {
                name: 'Mansions',
                slug: 'mansions',
                description: 'Large luxury homes',
              },
            ],
          },
          {
            name: 'Vacation Properties',
            slug: 'vacation-properties',
            description: 'Holiday and leisure properties',
            children: [
              {
                name: 'Beach Houses',
                slug: 'beach-houses',
                description: 'Coastal properties',
              },
              {
                name: 'Holiday Villas',
                slug: 'holiday-villas',
                description: 'Vacation homes',
              },
              {
                name: 'Mountain Cabins',
                slug: 'mountain-cabins',
                description: 'Mountain retreats',
              },
              {
                name: 'Lake Houses',
                slug: 'lake-houses',
                description: 'Waterfront properties',
              },
              {
                name: 'Resort Residences',
                slug: 'resort-residences',
                description: 'Resort-based homes',
              },
              {
                name: 'Timeshares',
                slug: 'timeshares',
                description: 'Shared ownership properties',
              },
            ],
          },
          {
            name: 'Senior Living',
            slug: 'senior-living',
            description: 'Properties for elderly residents',
            children: [
              {
                name: 'Retirement Communities',
                slug: 'retirement-communities',
                description: 'Age-restricted communities',
              },
              {
                name: 'Assisted Living',
                slug: 'assisted-living',
                description: 'Supported living facilities',
              },
              {
                name: 'Independent Living',
                slug: 'independent-living',
                description: 'Senior-focused apartments',
              },
              {
                name: 'Care Homes',
                slug: 'care-homes',
                description: 'Full-service care facilities',
              },
            ],
          },
        ],
      },
      {
        name: 'Commercial Properties',
        slug: 'commercial-properties',
        description: 'Properties for business use',
        children: [
          {
            name: 'Office Spaces',
            slug: 'office-spaces',
            description: 'Business office properties',
            children: [
              {
                name: 'Business Parks',
                slug: 'business-parks',
                description: 'Office complexes',
              },
              {
                name: 'Corporate Offices',
                slug: 'corporate-offices',
                description: 'Large office buildings',
              },
              {
                name: 'Coworking Spaces',
                slug: 'coworking-spaces',
                description: 'Shared workspaces',
              },
              {
                name: 'Serviced Offices',
                slug: 'serviced-offices',
                description: 'Managed office spaces',
              },
              {
                name: 'Executive Suites',
                slug: 'executive-suites',
                description: 'Premium office spaces',
              },
            ],
          },
          {
            name: 'Retail Spaces',
            slug: 'retail-spaces',
            description: 'Shopping and retail properties',
            children: [
              {
                name: 'Shopping Centers',
                slug: 'shopping-centers',
                description: 'Retail complexes',
              },
              {
                name: 'Shop Houses',
                slug: 'shop-houses',
                description: 'Combined retail and living spaces',
              },
              {
                name: 'Street Shops',
                slug: 'street-shops',
                description: 'Individual retail units',
              },
              {
                name: 'Mall Spaces',
                slug: 'mall-spaces',
                description: 'Shopping mall units',
              },
              {
                name: 'Restaurant Spaces',
                slug: 'restaurant-spaces',
                description: 'Food service properties',
              },
              {
                name: 'Showrooms',
                slug: 'showrooms',
                description: 'Display spaces',
              },
            ],
          },
          {
            name: 'Industrial Properties',
            slug: 'industrial-properties',
            description: 'Manufacturing and storage facilities',
            children: [
              {
                name: 'Warehouses',
                slug: 'warehouses',
                description: 'Storage facilities',
              },
              {
                name: 'Factories',
                slug: 'factories',
                description: 'Manufacturing facilities',
              },
              {
                name: 'Industrial Parks',
                slug: 'industrial-parks',
                description: 'Industrial complexes',
              },
              {
                name: 'Distribution Centers',
                slug: 'distribution-centers',
                description: 'Logistics facilities',
              },
              {
                name: 'Light Industrial',
                slug: 'light-industrial',
                description: 'Small industrial units',
              },
              {
                name: 'Heavy Industrial',
                slug: 'heavy-industrial',
                description: 'Large industrial facilities',
              },
            ],
          },
          {
            name: 'Hospitality Properties',
            slug: 'hospitality-properties',
            description: 'Accommodation and leisure facilities',
            children: [
              {
                name: 'Hotels',
                slug: 'hotels',
                description: 'Lodging properties',
              },
              {
                name: 'Motels',
                slug: 'motels',
                description: 'Roadside accommodations',
              },
              {
                name: 'Resorts',
                slug: 'resorts',
                description: 'Vacation facilities',
              },
              {
                name: 'Guest Houses',
                slug: 'guest-houses',
                description: 'Small accommodations',
              },
              {
                name: 'Event Venues',
                slug: 'event-venues',
                description: 'Function facilities',
              },
            ],
          },
        ],
      },
      {
        name: 'Land',
        slug: 'land',
        description: 'Undeveloped property',
        children: [
          {
            name: 'Residential Land',
            slug: 'residential-land',
            description: 'Land for housing development',
            children: [
              {
                name: 'Housing Plots',
                slug: 'housing-plots',
                description: 'Individual house lots',
              },
              {
                name: 'Development Sites',
                slug: 'development-sites',
                description: 'Multi-unit development land',
              },
              {
                name: 'Gated Community Plots',
                slug: 'gated-community-plots',
                description: 'Secure development land',
              },
              {
                name: 'Villa Plots',
                slug: 'villa-plots',
                description: 'Luxury home sites',
              },
            ],
          },
          {
            name: 'Commercial Land',
            slug: 'commercial-land',
            description: 'Land for business development',
            children: [
              {
                name: 'Office Development',
                slug: 'office-development',
                description: 'Office building sites',
              },
              {
                name: 'Retail Development',
                slug: 'retail-development',
                description: 'Shopping development sites',
              },
              {
                name: 'Mixed-Use Sites',
                slug: 'mixed-use-sites',
                description: 'Multi-purpose development land',
              },
              {
                name: 'Hotel Sites',
                slug: 'hotel-sites',
                description: 'Hospitality development land',
              },
            ],
          },
          {
            name: 'Industrial Land',
            slug: 'industrial-land',
            description: 'Land for industrial use',
            children: [
              {
                name: 'Factory Sites',
                slug: 'factory-sites',
                description: 'Manufacturing development land',
              },
              {
                name: 'Warehouse Sites',
                slug: 'warehouse-sites',
                description: 'Storage facility land',
              },
              {
                name: 'Industrial Park Plots',
                slug: 'industrial-park-plots',
                description: 'Industrial complex sites',
              },
              {
                name: 'Logistics Sites',
                slug: 'logistics-sites',
                description: 'Distribution center land',
              },
            ],
          },
          {
            name: 'Agricultural Land',
            slug: 'agricultural-land',
            description: 'Land for farming and agriculture',
            children: [
              {
                name: 'Farmland',
                slug: 'farmland',
                description: 'Crop farming land',
              },
              {
                name: 'Ranch Land',
                slug: 'ranch-land',
                description: 'Livestock farming land',
              },
              {
                name: 'Plantation Land',
                slug: 'plantation-land',
                description: 'Commercial crop land',
              },
              {
                name: 'Orchard Land',
                slug: 'orchard-land',
                description: 'Fruit farming land',
              },
            ],
          },
        ],
      },
      {
        name: 'Special Purpose Properties',
        slug: 'special-purpose-properties',
        description: 'Properties for specific uses',
        children: [
          {
            name: 'Educational Properties',
            slug: 'educational-properties',
            description: 'Educational institutions',
            children: [
              {
                name: 'Schools',
                slug: 'schools',
                description: 'Primary/secondary education facilities',
              },
              {
                name: 'Universities',
                slug: 'universities',
                description: 'Higher education facilities',
              },
              {
                name: 'Training Centers',
                slug: 'training-centers',
                description: 'Professional education facilities',
              },
              {
                name: 'Research Facilities',
                slug: 'research-facilities',
                description: 'Research institutions',
              },
            ],
          },
          {
            name: 'Healthcare Properties',
            slug: 'healthcare-properties',
            description: 'Medical facilities',
            children: [
              {
                name: 'Hospitals',
                slug: 'hospitals',
                description: 'Medical treatment facilities',
              },
              {
                name: 'Clinics',
                slug: 'clinics',
                description: 'Outpatient facilities',
              },
              {
                name: 'Medical Centers',
                slug: 'medical-centers',
                description: 'Healthcare complexes',
              },
              {
                name: 'Nursing Homes',
                slug: 'nursing-homes',
                description: 'Long-term care facilities',
              },
            ],
          },
          {
            name: 'Religious Properties',
            slug: 'religious-properties',
            description: 'Places of worship',
            children: [
              {
                name: 'Churches',
                slug: 'churches',
                description: 'Christian worship facilities',
              },
              {
                name: 'Mosques',
                slug: 'mosques',
                description: 'Islamic worship facilities',
              },
              {
                name: 'Temples',
                slug: 'temples',
                description: 'Various religious facilities',
              },
              {
                name: 'Religious Centers',
                slug: 'religious-centers',
                description: 'Multi-purpose religious facilities',
              },
            ],
          },
          {
            name: 'Government Properties',
            slug: 'government-properties',
            description: 'Public sector facilities',
            children: [
              {
                name: 'Administrative Buildings',
                slug: 'administrative-buildings',
                description: 'Government offices',
              },
              {
                name: 'Public Services',
                slug: 'public-services',
                description: 'Service facilities',
              },
              {
                name: 'Military Facilities',
                slug: 'military-facilities',
                description: 'Defense properties',
              },
              {
                name: 'Municipal Buildings',
                slug: 'municipal-buildings',
                description: 'Local government facilities',
              },
            ],
          },
        ],
      },
    ];
  }
}
