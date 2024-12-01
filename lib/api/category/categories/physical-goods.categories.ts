import { PresetCategory, CategoryCreator, createSlug } from '../category.types';

export class PhysicalGoodsCategories implements CategoryCreator {
  getCategories(): PresetCategory[] {
    return [
      {
        name: 'Electronics & Technology',
        slug: 'electronics-technology',
        description: 'Electronic devices, gadgets, and technological products',
        children: [
          {
            name: 'Smartphones & Mobile',
            slug: 'smartphones-mobile',
            description: 'Mobile phones and accessories',
            children: [
              { name: 'Android Phones', slug: 'android-phones', description: 'Android-based smartphones' },
              { name: 'iPhones', slug: 'iphones', description: 'Apple iPhones' },
              { name: 'Feature Phones', slug: 'feature-phones', description: 'Basic mobile phones' },
              { name: 'Phone Cases', slug: 'phone-cases', description: 'Protective cases and covers' },
              { name: 'Screen Protectors', slug: 'screen-protectors', description: 'Screen protection accessories' },
              { name: 'Chargers & Cables', slug: 'chargers-cables', description: 'Charging accessories' },
              { name: 'Power Banks', slug: 'power-banks', description: 'Portable charging devices' }
            ]
          },
          {
            name: 'Computers & Laptops',
            slug: 'computers-laptops',
            description: 'Computing devices and accessories',
            children: [
              { name: 'Laptops', slug: 'laptops', description: 'Portable computers' },
              { name: 'Desktop PCs', slug: 'desktop-pcs', description: 'Desktop computers' },
              { name: 'PC Components', slug: 'pc-components', description: 'Computer parts and components' },
              { name: 'Monitors', slug: 'monitors', description: 'Computer displays' },
              { name: 'Printers & Scanners', slug: 'printers-scanners', description: 'Printing and scanning devices' },
              { name: 'Computer Peripherals', slug: 'computer-peripherals', description: 'External computer accessories' }
            ]
          },
          // ... continue with more detailed electronics categories
        ]
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Clothing, footwear, and fashion accessories',
        children: [
          {
            name: "Men's Fashion",
            slug: 'mens-fashion',
            description: 'Fashion items for men',
            children: [
              { name: 'T-Shirts & Polos', slug: 'mens-t-shirts-polos', description: 'Casual tops for men' },
              { name: 'Shirts', slug: 'mens-shirts', description: 'Formal and casual shirts' },
              { name: 'Pants & Trousers', slug: 'mens-pants-trousers', description: 'Bottoms for men' },
              { name: 'Suits & Blazers', slug: 'mens-suits-blazers', description: 'Formal wear for men' },
              { name: 'Jeans', slug: 'mens-jeans', description: 'Denim wear for men' },
              { name: 'Underwear', slug: 'mens-underwear', description: 'Men\'s undergarments' },
              { name: 'Socks', slug: 'mens-socks', description: 'Men\'s hosiery' },
              { name: 'Activewear', slug: 'mens-activewear', description: 'Athletic wear for men' }
            ]
          },
          // ... continue with detailed fashion categories
        ]
      },
      // ... continue with more main categories
    ];
  }
}