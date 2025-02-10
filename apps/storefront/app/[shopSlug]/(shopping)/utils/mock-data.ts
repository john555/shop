// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Category,
  Collection,
  ProductStatus,
  SalesChannel,
  MediaType,
} from '@/types/admin-api';

export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: ProductStatus;
  price?: number;
  compareAtPrice?: number;
  sku: string;
  available: number;
  category: Category | null;
  collections: number[];
  media: {
    id: string;
    url: string;
    alt: string;
    type: MediaType;
  }[];
  salesChannels: SalesChannel[];
  seoTitle: string;
  seoDescription: string;
  trackInventory: boolean;
  tags?: string[];
  options?: {
    name: string;
    values: string[];
  }[];
  variants?: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    available: number;
    options: {
      [key: string]: string;
    };
    media?: {
      id: string;
      url: string;
      alt: string;
      type: MediaType;
    }[];
    optionCombination?: string[];
  }[];
}

export const categories: (Category & { image: string })[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Eco-friendly electronic devices',
    slug: 'electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Sustainable tech accessories',
    slug: 'accessories',

    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Eco-conscious audio devices',
    slug: 'audio',

    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Sustainable home tech',
    slug: 'home-living',

    image:
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Eco-friendly outdoor tech',
    slug: 'outdoor',

    image:
      'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Renewable energy solutions',
    slug: 'energy',

    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'wearables',
    name: 'Wearables',
    description: 'Sustainable wearable technology',
    slug: 'wearables',

    image:
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Eco-friendly kitchen gadgets',
    slug: 'kitchen',

    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=300&q=80',
  },
];

export const products: Product[] = [
  {
    id: 'cm3zu0q9x0001uv1qv26xg4to',
    title: 'EcoCell Pro: Solar-Powered Smartphone',
    description:
      'A high-performance smartphone made from recycled materials with integrated solar charging capabilities.',
    slug: 'ecocell-pro-solar-smartphone',
    status: ProductStatus.Active,
    sku: 'ECO-PHONE-001',
    category: categories.find((c) => c.id === 'electronics')!,
    collections: [0, 5],
    media: [
      {
        id: 'cm3zu0qay0006uv1qzu6cfna2',
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoCell Pro: Solar-Powered Smartphone',
        type: MediaType.Photo,
      },
      {
        id: 'cm3zu0qay0007uv1qzu6cfna3',
        url: 'https://example.com/videos/ecocell-pro-demo.mp4',
        alt: 'EcoCell Pro Demo Video',
        type: MediaType.VIDEO,
      },
      {
        id: 'cm3zu0qay0008uv1qzu6cfna4',
        url: 'https://example.com/3d-models/ecocell-pro.glb',
        alt: 'EcoCell Pro 3D Model',
        type: MediaType.Model_3D,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoCell Pro: Solar-Powered Smartphone - Green Gadgets',
    seoDescription:
      'Experience the future of sustainable mobile technology with our solar-powered smartphone.',
    trackInventory: true,
    tags: ['eco-friendly', 'energy-efficient', 'innovative'],
    options: [
      {
        name: 'Storage',
        values: ['64GB', '128GB'],
      },
      {
        name: 'Color',
        values: ['Black', 'Green'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: '64GB - Black',
        price: 2200000,
        compareAtPrice: 2500000,
        sku: 'ECO-PHONE-001-64GB-BLACK',
        available: 50,
        options: {
          Storage: '64GB',
          Color: 'Black',
        },
        optionCombination: ['64GB', 'Black'],
      },
      {
        id: 'v2',
        title: '128GB - Black',
        price: 2400000,
        compareAtPrice: 2700000,
        sku: 'ECO-PHONE-001-128GB-BLACK',
        available: 30,
        options: {
          Storage: '128GB',
          Color: 'Black',
        },
        optionCombination: ['128GB', 'Black'],
      },
      {
        id: 'v3',
        title: '64GB - Green',
        price: 2200000,
        compareAtPrice: 2500000,
        sku: 'ECO-PHONE-001-64GB-GREEN',
        available: 20,
        options: {
          Storage: '64GB',
          Color: 'Green',
        },
        optionCombination: ['64GB', 'Green'],
      },
      {
        id: 'v4',
        title: '128GB - Green',
        price: 2400000,
        compareAtPrice: 2700000,
        sku: 'ECO-PHONE-001-128GB-GREEN',
        available: 25,
        options: {
          Storage: '128GB',
          Color: 'Green',
        },
        optionCombination: ['128GB', 'Green'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0002uv1qv26xg4tp',
    title: 'GreenBeats: Bamboo Wireless Earbuds',
    description:
      'Eco-friendly wireless earbuds made from sustainable bamboo with premium sound quality.',
    slug: 'greenbeats-bamboo-earbuds',
    status: ProductStatus.Active,
    sku: 'ECO-AUDIO-001',
    available: 200,
    category: categories.find((c) => c.id === 'audio')!,
    collections: [0, 3, 5],
    media: [
      {
        id: 'cm3zu0qay0007uv1qzu6cfna3',
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
        alt: 'GreenBeats: Bamboo Wireless Earbuds',
        type: MediaType.Photo,
      },
      {
        id: 'cm3zu0qay0007uv1qzu6cfna4',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=300&q=80',
        alt: 'GreenBeats: Bamboo Wireless Earbuds - In use',
        type: MediaType.Photo,
      },
      {
        id: 'cm3zu0qay0009uv1qzu6cfna5',
        url: 'https://example.com/videos/greenbeats-sound-demo.mp4',
        alt: 'GreenBeats Sound Quality Demo',
        type: MediaType.VIDEO,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'GreenBeats: Bamboo Wireless Earbuds - Green Gadgets',
    seoDescription:
      'Enjoy premium sound with our eco-friendly bamboo wireless earbuds.',
    trackInventory: true,
    tags: ['eco-friendly', 'sustainable', 'premium sound'],
    options: [
      {
        name: 'Color',
        values: ['Natural', 'Dark'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'Natural Bamboo',
        price: 450000,
        compareAtPrice: 500000,
        sku: 'ECO-AUDIO-001-NATURAL',
        available: 100,
        options: {
          Color: 'Natural',
        },
        optionCombination: ['Natural'],
      },
      {
        id: 'v2',
        title: 'Dark Bamboo',
        price: 470000,
        compareAtPrice: 520000,
        sku: 'ECO-AUDIO-001-DARK',
        available: 100,
        options: {
          Color: 'Dark',
        },
        optionCombination: ['Dark'],
        media: [
          {
            id: 'cm3zu0qay0007uv1qzu6cfna5',
            url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=300&q=80',
            alt: 'GreenBeats: Bamboo Wireless Earbuds - Dark Bamboo',
            type: MediaType.Photo,
          },
        ],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0003uv1qv26xg4tq',
    title: 'EcoCharge Duo: Recycled Plastic Wireless Charging Pad',
    description:
      'Dual wireless charging pad made from 100% recycled plastics, compatible with all Qi-enabled devices.',
    slug: 'ecocharge-duo-wireless-pad',
    status: ProductStatus.Active,
    price: 180000,
    compareAtPrice: 200000,
    sku: 'ECO-CHARGE-001',
    available: 300,
    category: categories.find((c) => c.id === 'accessories')!,
    collections: [0, 1, 2, 4],
    media: [
      {
        id: 'cm3zu0qay0008uv1qzu6cfna4',
        url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoCharge Duo: Recycled Plastic Wireless Charging Pad',
        type: MediaType.Photo,
      },
      {
        id: 'cm3zu0qay0010uv1qzu6cfna6',
        url: 'https://example.com/3d-models/ecocharge-duo.glb',
        alt: 'EcoCharge Duo 3D Model',
        type: MediaType.Model_3D,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle:
      'EcoCharge Duo: Recycled Plastic Wireless Charging Pad - Green Gadgets',
    seoDescription:
      'Charge your devices sustainably with our dual wireless charging pad made from recycled plastics.',
    trackInventory: true,
    tags: ['recycled', 'wireless', 'dual charging'],
    options: [
      {
        name: 'Color',
        values: ['White', 'Black'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'White',
        price: 180000,
        compareAtPrice: 200000,
        sku: 'ECO-CHARGE-001-WHITE',
        available: 150,
        options: {
          Color: 'White',
        },
        optionCombination: ['White'],
      },
      {
        id: 'v2',
        title: 'Black',
        price: 180000,
        compareAtPrice: 200000,
        sku: 'ECO-CHARGE-001-BLACK',
        available: 150,
        options: {
          Color: 'Black',
        },
        optionCombination: ['Black'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0004uv1qv26xg4tr',
    title: 'SolarFlow Pro: Portable Solar Power Bank',
    description:
      'High-capacity power bank with integrated solar panel for eco-friendly charging on the go.',
    slug: 'solarflow-pro-power-bank',
    status: ProductStatus.Active,
    price: 350000,
    compareAtPrice: 400000,
    sku: 'ECO-POWER-001',
    available: 150,
    category: categories.find((c) => c.id === 'accessories')!,
    collections: [0, 1, 2, 6],
    media: [
      {
        id: 'cm3zu0qay0009uv1qzu6cfna5',
        url: 'https://images.unsplash.com/photo-1604671801908-6f0463e9446b?auto=format&fit=crop&w=300&q=80',
        alt: 'SolarFlow Pro: Portable Solar Power Bank',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'SolarFlow Pro: Portable Solar Power Bank - Green Gadgets',
    seoDescription:
      'Stay charged sustainably with our high-capacity solar power bank, perfect for outdoor adventures.',
    trackInventory: true,
    tags: ['solar', 'portable', 'high-capacity'],
    options: [
      {
        name: 'Capacity',
        values: ['10000mAh', '20000mAh'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: '10000mAh',
        price: 350000,
        compareAtPrice: 400000,
        sku: 'ECO-POWER-001-10000',
        available: 75,
        options: {
          Capacity: '10000mAh',
        },
        optionCombination: ['10000mAh'],
      },
      {
        id: 'v2',
        title: '20000mAh',
        price: 450000,
        compareAtPrice: 500000,
        sku: 'ECO-POWER-001-20000',
        available: 75,
        options: {
          Capacity: '20000mAh',
        },
        optionCombination: ['20000mAh'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0005uv1qv26xg4ts',
    title: 'EcoScreen: Recycled Aluminum Monitor',
    description:
      '27-inch 4K monitor made from recycled aluminum with energy-efficient LED backlight.',
    slug: 'ecoscreen-recycled-monitor',
    status: ProductStatus.Active,
    price: 1800000,
    compareAtPrice: 2000000,
    sku: 'ECO-MONITOR-001',
    available: 75,
    category: categories.find((c) => c.id === 'electronics')!,
    collections: [1, 4],
    media: [
      {
        id: 'cm3zu0qay0010uv1qzu6cfna6',
        url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoScreen: Recycled Aluminum Monitor',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoScreen: Recycled Aluminum Monitor - Green Gadgets',
    seoDescription:
      'Experience stunning visuals with our eco-friendly 4K monitor made from recycled materials.',
    trackInventory: true,
    tags: ['recycled', '4k', 'energy-efficient'],
    variants: [
      {
        id: 'v1',
        title: '27-inch 4K',
        price: 1800000,
        compareAtPrice: 2000000,
        sku: 'ECO-MONITOR-001-27-4K',
        available: 75,
        options: {
          Size: '27-inch 4K',
        },
        optionCombination: ['27-inch 4K'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0006uv1qv26xg4tt',
    title: 'EcoBreeze: Smart Bamboo Ceiling Fan',
    description:
      'Energy-efficient smart ceiling fan made from sustainable bamboo with app control and scheduling.',
    slug: 'ecobreeze-smart-bamboo-fan',
    status: ProductStatus.Active,
    price: 750000,
    compareAtPrice: 850000,
    sku: 'ECO-FAN-001',
    available: 100,
    category: categories.find((c) => c.id === 'home')!,
    collections: [1, 7],
    media: [
      {
        id: 'cm3zu0qay0011uv1qzu6cfna7',
        url: 'https://images.unsplash.com/photo-1614626742385-41c27d6e9271?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoBreeze: Smart Bamboo Ceiling Fan',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoBreeze: Smart Bamboo Ceiling Fan - Green Gadgets',
    seoDescription:
      'Cool your home efficiently with our sustainable smart bamboo ceiling fan.',
    trackInventory: true,
    tags: ['bamboo', 'smart', 'energy-efficient'],
    options: [
      {
        name: 'Color',
        values: ['Natural Bamboo'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'Natural Bamboo',
        price: 750000,
        compareAtPrice: 850000,
        sku: 'ECO-FAN-001-NATURAL',
        available: 100,
        options: {
          Color: 'Natural Bamboo',
        },
        optionCombination: ['Natural Bamboo'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0007uv1qv26xg4tu',
    title: 'SolarGlow: Solar-Powered LED Garden Lights (Set of 4)',
    description:
      'Weatherproof solar-powered LED garden lights made from recycled materials, perfect for eco-friendly outdoor lighting.',
    slug: 'solarglow-garden-lights',
    status: ProductStatus.Active,
    price: 280000,
    compareAtPrice: 320000,
    sku: 'ECO-LIGHT-001',
    available: 200,
    category: categories.find((c) => c.id === 'outdoor')!,
    collections: [1, 2, 6, 7],
    media: [
      {
        id: 'cm3zu0qay0012uv1qzu6cfna8',
        url: 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=300&q=80',
        alt: 'SolarGlow: Solar-Powered LED Garden Lights',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'SolarGlow: Solar-Powered LED Garden Lights - Green Gadgets',
    seoDescription:
      'Illuminate your garden sustainably with our solar-powered LED lights made from recycled materials.',
    trackInventory: true,
    tags: ['solar', 'led', 'outdoor'],
    variants: [
      {
        id: 'v1',
        title: 'Set of 4',
        price: 280000,
        compareAtPrice: 320000,
        sku: 'ECO-LIGHT-001-SET4',
        available: 200,
        options: {
          Quantity: 'Set of 4',
        },
        optionCombination: ['Set of 4'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0008uv1qv26xg4tv',
    title: 'EcoTrack Fit: Recycled Plastic Fitness Tracker',
    description:
      'Waterproof fitness tracker made from recycled ocean plastics, featuring heart rate monitoring and eco-friendly packaging.',
    slug: 'ecotrack-fit-fitness-tracker',
    status: ProductStatus.Active,
    price: 320000,
    compareAtPrice: 350000,
    sku: 'ECO-FIT-001',
    available: 150,
    category: categories.find((c) => c.id === 'wearables')!,
    collections: [3],
    media: [
      {
        id: 'cm3zu0qay0013uv1qzu6cfna9',
        url: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoTrack Fit: Recycled Plastic Fitness Tracker',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoTrack Fit: Recycled Plastic Fitness Tracker - Green Gadgets',
    seoDescription:
      'Track your fitness goals sustainably with our recycled plastic fitness tracker.',
    trackInventory: true,
    tags: ['recycled', 'fitness', 'waterproof'],
    options: [
      {
        name: 'Color',
        values: ['Black'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'Black',
        price: 320000,
        compareAtPrice: 350000,
        sku: 'ECO-FIT-001-BLACK',
        available: 150,
        options: {
          Color: 'Black',
        },
        optionCombination: ['Black'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0009uv1qv26xg4tw',
    title: 'EcoKettle: Smart Energy-Saving Electric Kettle',
    description:
      'Precision temperature control kettle made from recycled stainless steel, designed for energy efficiency.',
    slug: 'ecokettle-smart-electric-kettle',
    status: ProductStatus.Active,
    price: 220000,
    compareAtPrice: 250000,
    sku: 'ECO-KETTLE-001',
    available: 100,
    category: categories.find((c) => c.id === 'kitchen')!,
    collections: [2, 4],
    media: [
      {
        id: 'cm3zu0qay0014uv1qzu6cfna10',
        url: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoKettle: Smart Energy-Saving Electric Kettle',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoKettle: Smart Energy-Saving Electric Kettle - Green Gadgets',
    seoDescription:
      'Boil water efficiently with our smart, eco-friendly electric kettle made from recycled materials.',
    trackInventory: true,
    tags: ['recycled', 'smart', 'energy-efficient'],
    options: [
      {
        name: 'Material',
        values: ['Stainless Steel'],
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'Stainless Steel',
        price: 220000,
        compareAtPrice: 250000,
        sku: 'ECO-KETTLE-001-STEEL',
        available: 100,
        options: {
          Material: 'Stainless Steel',
        },
        optionCombination: ['Stainless Steel'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0010uv1qv26xg4tx',
    title: 'SolarRoof Tile: Integrated Solar Panel Roofing',
    description:
      'Durable and efficient solar panel roof tiles that blend seamlessly with traditional roofing materials.',
    slug: 'solarroof-tile-integrated-solar-panel',
    status: ProductStatus.Active,
    price: 50000000,
    compareAtPrice: 55000000,
    sku: 'ECO-SOLAR-001',
    available: 50,
    category: categories.find((c) => c.id === 'energy')!,
    collections: [1, 6],
    media: [
      {
        id: 'cm3zu0qay0015uv1qzu6cfna11',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=300&q=80',
        alt: 'SolarRoof Tile: Integrated Solar Panel Roofing',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'SolarRoof Tile: Integrated Solar Panel Roofing - Green Gadgets',
    seoDescription:
      'Transform your roof into a power generator with our sleek, integrated solar panel roof tiles.',
    trackInventory: true,
    tags: ['solar', 'roofing', 'durable'],
    variants: [
      {
        id: 'v1',
        title: 'Standard',
        price: 50000000,
        compareAtPrice: 55000000,
        sku: 'ECO-SOLAR-001-STANDARD',
        available: 50,
        options: {
          Type: 'Standard',
        },
        optionCombination: ['Standard'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0011uv1qv26xg4ty',
    title: 'EcoFriendly Bamboo Laptop Stand',
    description:
      'Ergonomic laptop stand made from sustainable bamboo, perfect for improving posture and reducing neck strain.',
    slug: 'eco-friendly-bamboo-laptop-stand',
    status: ProductStatus.Active,
    price: 89000,
    compareAtPrice: 99000,
    sku: 'ECO-STAND-001',
    available: 100,
    category: categories.find((c) => c.id === 'accessories')!,
    collections: [1, 4],
    media: [
      {
        id: 'cm3zu0qay0016uv1qzu6cfna12',
        url: 'https://images.unsplash.com/photo-1616509091215-57bbad8dd114?auto=format&fit=crop&w=300&q=80',
        alt: 'EcoFriendly Bamboo Laptop Stand',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'EcoFriendly Bamboo Laptop Stand - Green Gadgets',
    seoDescription:
      'Improve your posture and work comfortably with our sustainable bamboo laptop stand.',
    trackInventory: true,
    tags: ['eco-friendly', 'ergonomic', 'bamboo'],
    variants: [
      {
        id: 'v1',
        title: 'Bamboo',
        price: 89000,
        compareAtPrice: 99000,
        sku: 'ECO-STAND-001-BAMBOO',
        available: 100,
        options: {
          Material: 'Bamboo',
        },
        optionCombination: ['Bamboo'],
      },
    ],
  },
  {
    id: 'cm3zu0q9x0012uv1qv26xg4tz',
    title: 'Recycled Plastic Wireless Mouse',
    description:
      'Comfortable and responsive wireless mouse made from recycled ocean plastics.',
    slug: 'recycled-plastic-wireless-mouse',
    status: ProductStatus.Active,
    price: 45000,
    sku: 'ECO-MOUSE-001',
    available: 200,
    category: categories.find((c) => c.id === 'accessories')!,
    collections: [0, 4],
    media: [
      {
        id: 'cm3zu0qay0017uv1qzu6cfna13',
        url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=80',
        alt: 'Recycled Plastic Wireless Mouse',
        type: MediaType.Photo,
      },
    ],
    salesChannels: [SalesChannel.Online],
    seoTitle: 'Recycled Plastic Wireless Mouse - Green Gadgets',
    seoDescription:
      'Experience comfort and sustainability with our wireless mouse made from recycled ocean plastics.',
    trackInventory: true,
    tags: ['recycled', 'wireless', 'ergonomic'],
    variants: [
      {
        id: 'v1',
        title: 'Recycled Plastic',
        price: 45000,
        sku: 'ECO-MOUSE-001-RECYCLED',
        available: 200,
        options: {
          Material: 'Recycled Plastic',
        },
        optionCombination: ['Recycled Plastic'],
      },
    ],
  },
];

export const collections: Collection[] = [
  {
    id: 'cm3zd2k0p0008dcz8mb7s74pe',
    name: 'Eco-Tech Essentials',
    description: 'Our most popular sustainable gadgets for everyday use.',
    slug: 'eco-tech-essentials',
    isActive: true,
    seoTitle: 'Eco-Tech Essentials - Green Gadgets',
    seoDescription:
      'Discover our top-rated eco-friendly tech products for a sustainable lifestyle.',
    media: [
      {
        id: 'cm3zd2k0m0001dcz8mb7s74pa',
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
        alt: 'Eco-Tech Essentials Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[0], products[1], products[2], products[3]],
  },
  {
    id: 'cm3zd2k0p0010dcz8mb7s74pg',
    name: 'Energy Savers',
    description:
      'Devices designed to reduce your carbon footprint and energy bills.',
    slug: 'energy-savers',
    isActive: true,
    seoTitle: 'Energy-Saving Devices - Green Gadgets',
    seoDescription:
      'Explore our range of energy-efficient gadgets for a greener home and lifestyle.',
    media: [
      {
        id: 'cm3zd2k0m0002dcz8mb7s74pb',
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80',
        alt: 'Energy Savers Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[4], products[5], products[6], products[9]],
  },
  {
    id: 'cm3zd2k0p0011dcz8mb7s74ph',
    name: 'Sustainable Living',
    description:
      'Products that promote an eco-friendly lifestyle at home and beyond.',
    slug: 'sustainable-living',
    isActive: true,
    seoTitle: 'Sustainable Living Products - Green Gadgets',
    seoDescription:
      'Discover innovative products for a more sustainable and eco-conscious lifestyle.',
    media: [
      {
        id: 'cm3zd2k0m0003dcz8mb7s74pc',
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=300&q=80',
        alt: 'Sustainable Living Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[2], products[3], products[6], products[8]],
  },
  {
    id: 'cm3zd2k0p0012dcz8mb7s74pi',
    name: 'Eco-Friendly Wearables',
    description:
      'Sustainable tech you can wear, from smartwatches to fitness trackers.',
    slug: 'eco-friendly-wearables',
    isActive: true,
    seoTitle: 'Eco-Friendly Wearable Tech - Green Gadgets',
    seoDescription:
      'Explore our collection of sustainable wearable technology for health and fitness.',
    media: [
      {
        id: 'cm3zd2k0m0004dcz8mb7s74pd',
        url: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=300&q=80',
        alt: 'Eco-Friendly Wearables Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[7], products[1]],
  },
  {
    id: 'cm3zd2k0p0013dcz8mb7s74pj',
    name: 'Green Office',
    description: 'Sustainable solutions for a more eco-conscious workspace.',
    slug: 'green-office',
    isActive: true,
    seoTitle: 'Green Office Solutions - Green Gadgets',
    seoDescription:
      'Transform your workspace with our eco-friendly office technology and accessories.',
    media: [
      {
        id: 'cm3zd2k0m0005dcz8mb7s74pe',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
        alt: 'Green Office Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[4], products[2], products[8]],
  },
  {
    id: 'cm3zd2k0p0014dcz8mb7s74pk',
    name: 'Eco-Friendly Audio',
    description:
      'Sustainable sound solutions for music lovers and audiophiles.',
    slug: 'eco-friendly-audio',
    isActive: true,
    seoTitle: 'Eco-Friendly Audio Devices - Green Gadgets',
    seoDescription:
      'Experience high-quality sound with our range of sustainable audio products.',
    media: [
      {
        id: 'cm3zd2k0m0006dcz8mb7s74pf',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        alt: 'Eco-Friendly Audio Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[1], products[0]],
  },
  {
    id: 'cm3zd2k0p0015dcz8mb7s74pl',
    name: 'Solar Solutions',
    description:
      'Harness the power of the sun with our range of solar-powered devices.',
    slug: 'solar-solutions',
    isActive: true,
    seoTitle: 'Solar-Powered Devices - Green Gadgets',
    seoDescription:
      'Explore our collection of innovative solar-powered gadgets for a sustainable lifestyle.',
    media: [
      {
        id: 'cm3zd2k0m0007dcz8mb7s74pg',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=300&q=80',
        alt: 'Solar Solutions Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[3], products[6], products[9]],
  },
  {
    id: 'cm3zd2k0p0016dcz8mb7s74pm',
    name: 'Eco-Friendly Lighting',
    description:
      'Illuminate your space sustainably with our energy-efficient lighting solutions.',
    slug: 'eco-friendly-lighting',
    isActive: true,
    seoTitle: 'Eco-Friendly Lighting Solutions - Green Gadgets',
    seoDescription:
      'Discover our range of sustainable and energy-efficient lighting options for your home or office.',
    media: [
      {
        id: 'cm3zd2k0m0008dcz8mb7s74ph',
        url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=300&q=80',
        alt: 'Eco-Friendly Lighting Collection',
        type: MediaType.Photo,
      },
    ],
    products: [products[6], products[5]],
  },
];

export const storeDetails = {
  name: 'Green Gadgets',
  description: 'Eco-friendly tech for a sustainable future',
  logo: '',
};

export const reviews = [
  {
    id: 1,
    name: 'Alex Johnson',
    rating: 5,
    comment:
      "The EcoCell Pro is amazing! Great battery life and I love knowing it's environmentally friendly.",
    product: 'EcoCell Pro: Solar-Powered Smartphone',
  },
  {
    id: 2,
    name: 'Sam Lee',
    rating: 4.5,
    comment: 'SolarFlow Pro works great. Perfect for camping trips!',
    product: 'SolarFlow Pro: Portable Solar Power Bank',
  },
  {
    id: 3,
    name: 'Jamie Smith',
    rating: 5,
    comment:
      'The EcoScreen is stunning and I feel good about its recycled materials.',
    product: 'EcoScreen: Recycled Aluminum Monitor',
  },
  {
    id: 4,
    name: 'Taylor Wong',
    rating: 4,
    comment:
      'GreenBeats have surprisingly good sound quality. Comfortable too!',
    product: 'GreenBeats: Bamboo Wireless Earbuds',
  },
  {
    id: 5,
    name: 'Jordan Patel',
    rating: 5,
    comment:
      'The EcoCharge Duo is sleek and works perfectly with all my devices.',
    product: 'EcoCharge Duo: Recycled Plastic Wireless Charging Pad',
  },
  {
    id: 6,
    name: 'Casey Morgan',
    rating: 4.5,
    comment:
      'The EcoBreeze fan is not only beautiful but also very quiet and efficient!',
    product: 'EcoBreeze: Smart Bamboo Ceiling Fan',
  },
  {
    id: 7,
    name: 'Riley Chen',
    rating: 5,
    comment:
      "SolarGlow lights have transformed my garden. They're bright and last all night!",
    product: 'SolarGlow: Solar-Powered LED Garden Lights',
  },
  {
    id: 8,
    name: 'Quinn Patel',
    rating: 4,
    comment:
      "EcoTrack Fit is comfortable and I love that it's made from recycled materials.",
    product: 'EcoTrack Fit: Recycled Plastic Fitness Tracker',
  },
  {
    id: 9,
    name: 'Avery Thompson',
    rating: 4.5,
    comment:
      "The EcoKettle is a game-changer. It's so precise and energy-efficient!",
    product: 'EcoKettle: Smart Energy-Saving Electric Kettle',
  },
  {
    id: 10,
    name: 'Morgan Lee',
    rating: 5,
    comment:
      'SolarRoof Tiles look great and have significantly reduced our energy bills.',
    product: 'SolarRoof Tile: Integrated Solar Panel Roofing',
  },
];

export const heroContent = {
  title: 'Sustainable Technology for a Greener Tomorrow',
  description:
    'Discover our range of eco-friendly gadgets that combine cutting-edge innovation with environmental responsibility.',
  videoSrc:
    'https://videos.pexels.com/video-files/8128402/8128402-uhd_2732_1440_25fps.mp4',
  imageSrc:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
};
