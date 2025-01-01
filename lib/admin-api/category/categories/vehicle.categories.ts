import { PresetCategory, CategoryCreator } from '../category.types';

export class VehicleCategories implements CategoryCreator {
  getCategories(): PresetCategory[] {
    return [
      {
        name: 'Passenger Vehicles',
        slug: 'passenger-vehicles',
        description: 'Cars and vehicles for personal transportation',
        children: [
          {
            name: 'Sedans',
            slug: 'sedans',
            description: 'Four-door passenger cars',
            children: [
              { name: 'Compact Sedans', slug: 'compact-sedans', description: 'Small four-door cars under 4.5m' },
              { name: 'Mid-size Sedans', slug: 'mid-size-sedans', description: 'Medium-sized family sedans' },
              { name: 'Full-size Sedans', slug: 'full-size-sedans', description: 'Large luxury sedans' },
              { name: 'Sport Sedans', slug: 'sport-sedans', description: 'High-performance sedans' },
              { name: 'Executive Sedans', slug: 'executive-sedans', description: 'Premium luxury sedans' }
            ]
          },
          {
            name: 'SUVs & Crossovers',
            slug: 'suvs-crossovers',
            description: 'Sport utility and crossover vehicles',
            children: [
              { name: 'Compact SUVs', slug: 'compact-suvs', description: 'Small sport utility vehicles' },
              { name: 'Mid-size SUVs', slug: 'mid-size-suvs', description: 'Medium-sized family SUVs' },
              { name: 'Full-size SUVs', slug: 'full-size-suvs', description: 'Large sport utility vehicles' },
              { name: 'Luxury SUVs', slug: 'luxury-suvs', description: 'Premium sport utility vehicles' },
              { name: 'Crossovers', slug: 'crossovers', description: 'Car-based utility vehicles' },
              { name: 'Off-road SUVs', slug: 'off-road-suvs', description: 'Trail-capable utility vehicles' }
            ]
          },
          {
            name: 'Hatchbacks',
            slug: 'hatchbacks',
            description: 'Vehicles with rear door access to cargo area',
            children: [
              { name: 'Compact Hatchbacks', slug: 'compact-hatchbacks', description: 'Small hatchback cars' },
              { name: 'Mid-size Hatchbacks', slug: 'mid-size-hatchbacks', description: 'Medium-sized hatchbacks' },
              { name: 'Premium Hatchbacks', slug: 'premium-hatchbacks', description: 'Luxury hatchback vehicles' },
              { name: 'Sport Hatchbacks', slug: 'sport-hatchbacks', description: 'Performance-oriented hatchbacks' }
            ]
          },
          {
            name: 'Station Wagons',
            slug: 'station-wagons',
            description: 'Extended roof vehicles with cargo area',
            children: [
              { name: 'Compact Wagons', slug: 'compact-wagons', description: 'Small station wagons' },
              { name: 'Mid-size Wagons', slug: 'mid-size-wagons', description: 'Medium-sized wagons' },
              { name: 'Luxury Wagons', slug: 'luxury-wagons', description: 'Premium station wagons' },
              { name: 'Sport Wagons', slug: 'sport-wagons', description: 'Performance-oriented wagons' }
            ]
          },
          {
            name: 'Sports Cars',
            slug: 'sports-cars',
            description: 'Performance-oriented vehicles',
            children: [
              { name: 'Coupes', slug: 'coupes', description: 'Two-door sports cars' },
              { name: 'Convertibles', slug: 'convertibles', description: 'Retractable roof vehicles' },
              { name: 'Super Cars', slug: 'super-cars', description: 'High-performance luxury sports cars' },
              { name: 'Muscle Cars', slug: 'muscle-cars', description: 'High-power traditional sports cars' },
              { name: 'GT Cars', slug: 'gt-cars', description: 'Grand touring vehicles' }
            ]
          }
        ]
      },
      {
        name: 'Commercial Vehicles',
        slug: 'commercial-vehicles',
        description: 'Vehicles for business and commercial use',
        children: [
          {
            name: 'Vans & Minivans',
            slug: 'vans-minivans',
            description: 'Passenger and cargo vans',
            children: [
              { name: 'Passenger Vans', slug: 'passenger-vans', description: 'People transport vans' },
              { name: 'Cargo Vans', slug: 'cargo-vans', description: 'Goods transport vans' },
              { name: 'Minivans', slug: 'minivans', description: 'Family passenger vans' },
              { name: 'Panel Vans', slug: 'panel-vans', description: 'Commercial delivery vans' },
              { name: 'Van Conversions', slug: 'van-conversions', description: 'Modified specialty vans' }
            ]
          },
          {
            name: 'Trucks',
            slug: 'trucks',
            description: 'Commercial trucks and pickups',
            children: [
              { name: 'Pickup Trucks', slug: 'pickup-trucks', description: 'Light duty pickup trucks' },
              { name: 'Light Duty Trucks', slug: 'light-duty-trucks', description: 'Small commercial trucks' },
              { name: 'Medium Duty Trucks', slug: 'medium-duty-trucks', description: 'Medium-sized trucks' },
              { name: 'Heavy Duty Trucks', slug: 'heavy-duty-trucks', description: 'Large commercial trucks' },
              { name: 'Box Trucks', slug: 'box-trucks', description: 'Enclosed cargo trucks' },
              { name: 'Flatbed Trucks', slug: 'flatbed-trucks', description: 'Open bed trucks' }
            ]
          },
          {
            name: 'Buses',
            slug: 'buses',
            description: 'Passenger transport vehicles',
            children: [
              { name: 'City Buses', slug: 'city-buses', description: 'Urban transport buses' },
              { name: 'Coach Buses', slug: 'coach-buses', description: 'Long-distance transport buses' },
              { name: 'Mini Buses', slug: 'mini-buses', description: 'Small passenger buses' },
              { name: 'School Buses', slug: 'school-buses', description: 'Student transport buses' },
              { name: 'Shuttle Buses', slug: 'shuttle-buses', description: 'Short-distance transport buses' }
            ]
          },
          {
            name: 'Special Purpose Vehicles',
            slug: 'special-purpose-vehicles',
            description: 'Specialized commercial vehicles',
            children: [
              { name: 'Garbage Trucks', slug: 'garbage-trucks', description: 'Waste collection vehicles' },
              { name: 'Tow Trucks', slug: 'tow-trucks', description: 'Vehicle recovery trucks' },
              { name: 'Fire Trucks', slug: 'fire-trucks', description: 'Emergency response vehicles' },
              { name: 'Food Trucks', slug: 'food-trucks', description: 'Mobile food service vehicles' },
              { name: 'Construction Vehicles', slug: 'construction-vehicles', description: 'Building site vehicles' }
            ]
          }
        ]
      },
      {
        name: 'Alternative Fuel Vehicles',
        slug: 'alternative-fuel-vehicles',
        description: 'Eco-friendly and alternative power vehicles',
        children: [
          {
            name: 'Electric Vehicles',
            slug: 'electric-vehicles',
            description: 'Battery-powered vehicles',
            children: [
              { name: 'Electric Cars', slug: 'electric-cars', description: 'Battery electric passenger cars' },
              { name: 'Electric SUVs', slug: 'electric-suvs', description: 'Battery electric utility vehicles' },
              { name: 'Electric Vans', slug: 'electric-vans', description: 'Battery electric commercial vans' },
              { name: 'Electric Trucks', slug: 'electric-trucks', description: 'Battery electric trucks' },
              { name: 'Electric Buses', slug: 'electric-buses', description: 'Battery electric buses' }
            ]
          },
          {
            name: 'Hybrid Vehicles',
            slug: 'hybrid-vehicles',
            description: 'Combined power source vehicles',
            children: [
              { name: 'Hybrid Cars', slug: 'hybrid-cars', description: 'Hybrid passenger cars' },
              { name: 'Plug-in Hybrids', slug: 'plug-in-hybrids', description: 'Rechargeable hybrid vehicles' },
              { name: 'Hybrid SUVs', slug: 'hybrid-suvs', description: 'Hybrid utility vehicles' },
              { name: 'Commercial Hybrids', slug: 'commercial-hybrids', description: 'Hybrid commercial vehicles' }
            ]
          },
          {
            name: 'Other Alternative Fuel',
            slug: 'other-alternative-fuel',
            description: 'Other clean energy vehicles',
            children: [
              { name: 'Hydrogen Fuel Cell', slug: 'hydrogen-fuel-cell', description: 'Hydrogen-powered vehicles' },
              { name: 'Natural Gas', slug: 'natural-gas', description: 'Natural gas powered vehicles' },
              { name: 'Biodiesel', slug: 'biodiesel', description: 'Biodiesel powered vehicles' },
              { name: 'Flex Fuel', slug: 'flex-fuel', description: 'Multiple fuel type vehicles' }
            ]
          }
        ]
      },
      {
        name: 'Motorcycles',
        slug: 'motorcycles',
        description: 'Two-wheeled motor vehicles',
        children: [
          {
            name: 'Street Motorcycles',
            slug: 'street-motorcycles',
            description: 'Road-going motorcycles',
            children: [
              { name: 'Sport Bikes', slug: 'sport-bikes', description: 'Performance motorcycles' },
              { name: 'Cruisers', slug: 'cruisers', description: 'Relaxed riding motorcycles' },
              { name: 'Touring Bikes', slug: 'touring-bikes', description: 'Long-distance motorcycles' },
              { name: 'Standard Bikes', slug: 'standard-bikes', description: 'General-purpose motorcycles' },
              { name: 'Cafe Racers', slug: 'cafe-racers', description: 'Classic-style sport motorcycles' }
            ]
          },
          {
            name: 'Off-road Motorcycles',
            slug: 'off-road-motorcycles',
            description: 'Trail and dirt motorcycles',
            children: [
              { name: 'Dirt Bikes', slug: 'dirt-bikes', description: 'Off-road sport motorcycles' },
              { name: 'Trail Bikes', slug: 'trail-bikes', description: 'Recreational trail motorcycles' },
              { name: 'Enduro Bikes', slug: 'enduro-bikes', description: 'Dual-purpose motorcycles' },
              { name: 'Motocross Bikes', slug: 'motocross-bikes', description: 'Competition dirt bikes' }
            ]
          },
          {
            name: 'Scooters',
            slug: 'scooters',
            description: 'Step-through motorcycles',
            children: [
              { name: 'Regular Scooters', slug: 'regular-scooters', description: 'Traditional scooters' },
              { name: 'Maxi Scooters', slug: 'maxi-scooters', description: 'Large-frame scooters' },
              { name: 'Electric Scooters', slug: 'electric-scooters', description: 'Battery-powered scooters' },
              { name: 'Three-wheel Scooters', slug: 'three-wheel-scooters', description: 'Tricycle scooters' }
            ]
          }
        ]
      },
      {
        name: 'Vehicle Parts & Accessories',
        slug: 'vehicle-parts-accessories',
        description: 'Components and accessories for vehicles',
        children: [
          {
            name: 'Engine Components',
            slug: 'engine-components',
            description: 'Engine-related parts',
            children: [
              { name: 'Engine Parts', slug: 'engine-parts', description: 'Internal engine components' },
              { name: 'Fuel System', slug: 'fuel-system', description: 'Fuel delivery components' },
              { name: 'Exhaust System', slug: 'exhaust-system', description: 'Exhaust components' },
              { name: 'Cooling System', slug: 'cooling-system', description: 'Temperature control components' },
              { name: 'Air Intake', slug: 'air-intake', description: 'Air delivery systems' }
            ]
          },
          {
            name: 'Transmission & Drivetrain',
            slug: 'transmission-drivetrain',
            description: 'Power delivery components',
            children: [
              { name: 'Transmission Parts', slug: 'transmission-parts', description: 'Gearbox components' },
              { name: 'Clutch Components', slug: 'clutch-components', description: 'Clutch system parts' },
              { name: 'Differential Parts', slug: 'differential-parts', description: 'Differential components' },
              { name: 'Driveshaft Parts', slug: 'driveshaft-parts', description: 'Drive system components' }
            ]
          },
          {
            name: 'Electrical Parts',
            slug: 'electrical-parts',
            description: 'Electrical system components',
            children: [
              { name: 'Batteries', slug: 'batteries', description: 'Power storage' },
              { name: 'Lighting', slug: 'lighting', description: 'Vehicle lights' },
              { name: 'Sensors', slug: 'sensors', description: 'Electronic sensors' },
              { name: 'Ignition System', slug: 'ignition-system', description: 'Starting components' },
              { name: 'Audio & Electronics', slug: 'audio-electronics', description: 'Entertainment systems' }
            ]
          }
        ]
      }
    ];
  }
}