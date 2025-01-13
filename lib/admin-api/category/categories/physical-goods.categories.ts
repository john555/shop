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
              { name: 'Power Banks', slug: 'power-banks', description: 'Portable charging devices' },
              { name: 'Mobile Accessories', slug: 'mobile-accessories', description: 'Other phone accessories' }
            ]
          },
          {
            name: 'Computers & Laptops',
            slug: 'computers-laptops',
            description: 'Computing devices and accessories',
            children: [
              { name: 'Gaming Laptops', slug: 'gaming-laptops', description: 'High-performance gaming notebooks' },
              { name: 'Business Laptops', slug: 'business-laptops', description: 'Professional notebooks' },
              { name: 'Chromebooks', slug: 'chromebooks', description: 'Chrome OS laptops' },
              { name: 'Desktop PCs', slug: 'desktop-pcs', description: 'Pre-built desktop computers' },
              { name: 'Gaming PCs', slug: 'gaming-pcs', description: 'Gaming desktop computers' },
              { name: 'All-in-One PCs', slug: 'all-in-one-pcs', description: 'Integrated desktop systems' },
              { name: 'PC Components', slug: 'pc-components', description: 'Computer parts' },
              { name: 'Monitors', slug: 'monitors', description: 'Computer displays' }
            ]
          },
          {
            name: 'Computer Accessories',
            slug: 'computer-accessories',
            description: 'Peripherals and accessories for computers',
            children: [
              { name: 'Keyboards', slug: 'keyboards', description: 'Computer keyboards' },
              { name: 'Mice & Pointing', slug: 'mice-pointing', description: 'Computer mice and pointing devices' },
              { name: 'Webcams', slug: 'webcams', description: 'Video cameras for computers' },
              { name: 'Headsets', slug: 'headsets', description: 'Gaming and communication headsets' },
              { name: 'USB Hubs', slug: 'usb-hubs', description: 'USB port expansion devices' },
              { name: 'Storage Devices', slug: 'storage-devices', description: 'External storage solutions' },
              { name: 'Laptop Bags', slug: 'laptop-bags', description: 'Carrying cases for laptops' },
              { name: 'Laptop Stands', slug: 'laptop-stands', description: 'Ergonomic laptop supports' }
            ]
          },
          {
            name: 'Audio & Sound',
            slug: 'audio-sound',
            description: 'Audio equipment and accessories',
            children: [
              { name: 'Headphones', slug: 'headphones', description: 'Personal audio devices' },
              { name: 'Earbuds', slug: 'earbuds', description: 'In-ear audio devices' },
              { name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', description: 'Wireless speakers' },
              { name: 'Sound Systems', slug: 'sound-systems', description: 'Home audio systems' },
              { name: 'Microphones', slug: 'microphones', description: 'Recording devices' },
              { name: 'Audio Accessories', slug: 'audio-accessories', description: 'Audio-related accessories' }
            ]
          },
          {
            name: 'TV & Video',
            slug: 'tv-video',
            description: 'Television and video equipment',
            children: [
              { name: 'Smart TVs', slug: 'smart-tvs', description: 'Internet-connected televisions' },
              { name: 'LED TVs', slug: 'led-tvs', description: 'LED display televisions' },
              { name: 'OLED TVs', slug: 'oled-tvs', description: 'OLED display televisions' },
              { name: 'TV Mounts', slug: 'tv-mounts', description: 'Television wall mounts' },
              { name: 'Media Players', slug: 'media-players', description: 'Digital media players' },
              { name: 'Streaming Devices', slug: 'streaming-devices', description: 'Internet streaming devices' }
            ]
          },
          {
            name: 'Gaming & Entertainment',
            slug: 'gaming-entertainment',
            description: 'Gaming consoles and accessories',
            children: [
              { name: 'Gaming Consoles', slug: 'gaming-consoles', description: 'Video game systems' },
              { name: 'Console Games', slug: 'console-games', description: 'Games for consoles' },
              { name: 'Gaming Accessories', slug: 'gaming-accessories', description: 'Gaming peripherals' },
              { name: 'VR Hardware', slug: 'vr-hardware', description: 'Virtual reality equipment' },
              { name: 'Retro Gaming', slug: 'retro-gaming', description: 'Classic gaming systems' }
            ]
          },
          {
            name: 'Cameras & Photography',
            slug: 'cameras-photography',
            description: 'Photography equipment and accessories',
            children: [
              { name: 'Digital Cameras', slug: 'digital-cameras', description: 'Digital photography cameras' },
              { name: 'DSLR Cameras', slug: 'dslr-cameras', description: 'Digital SLR cameras' },
              { name: 'Mirrorless Cameras', slug: 'mirrorless-cameras', description: 'Mirrorless digital cameras' },
              { name: 'Action Cameras', slug: 'action-cameras', description: 'Sport and action cameras' },
              { name: 'Camera Lenses', slug: 'camera-lenses', description: 'Photography lenses' },
              { name: 'Camera Accessories', slug: 'camera-accessories', description: 'Photography accessories' }
            ]
          },
          {
            name: 'Smart Home',
            slug: 'smart-home',
            description: 'Smart home devices and automation',
            children: [
              { name: 'Smart Lighting', slug: 'smart-lighting', description: 'Connected lighting solutions' },
              { name: 'Smart Security', slug: 'smart-security', description: 'Connected security devices' },
              { name: 'Smart Speakers', slug: 'smart-speakers', description: 'Voice-controlled speakers' },
              { name: 'Smart Displays', slug: 'smart-displays', description: 'Connected display devices' },
              { name: 'Smart Plugs', slug: 'smart-plugs', description: 'Connected power outlets' },
              { name: 'Smart Thermostats', slug: 'smart-thermostats', description: 'Connected temperature control' }
            ]
          },
          {
            name: 'Wearable Technology',
            slug: 'wearable-technology',
            description: 'Wearable electronic devices',
            children: [
              { name: 'Smartwatches', slug: 'smartwatches', description: 'Connected watches' },
              { name: 'Fitness Trackers', slug: 'fitness-trackers', description: 'Activity monitoring devices' },
              { name: 'Smart Glasses', slug: 'smart-glasses', description: 'Connected eyewear' },
              { name: 'Smart Jewelry', slug: 'smart-jewelry', description: 'Connected accessories' },
              { name: 'Wearable Accessories', slug: 'wearable-accessories', description: 'Accessories for wearables' }
            ]
          }
        ]
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Clothing, footwear, and fashion accessories',
        children: [
          {
            name: "Men's Clothing",
            slug: 'mens-clothing',
            description: 'Clothing for men',
            children: [
              { name: 'T-Shirts & Polos', slug: 'mens-t-shirts-polos', description: 'Casual tops for men' },
              { name: 'Shirts', slug: 'mens-shirts', description: 'Formal and casual shirts' },
              { name: 'Pants & Trousers', slug: 'mens-pants-trousers', description: 'Formal and casual pants' },
              { name: 'Jeans', slug: 'mens-jeans', description: 'Denim pants' },
              { name: 'Suits & Blazers', slug: 'mens-suits-blazers', description: 'Formal wear' },
              { name: 'Jackets & Coats', slug: 'mens-jackets-coats', description: 'Outerwear' },
              { name: 'Sweaters & Cardigans', slug: 'mens-sweaters-cardigans', description: 'Knitwear' },
              { name: 'Activewear', slug: 'mens-activewear', description: 'Athletic clothing' },
              { name: 'Underwear', slug: 'mens-underwear', description: 'Undergarments' },
              { name: 'Sleepwear', slug: 'mens-sleepwear', description: 'Pajamas and loungewear' },
              { name: 'Swimwear', slug: 'mens-swimwear', description: 'Swimming attire' },
              { name: 'Socks', slug: 'mens-socks', description: 'Hosiery' }
            ]
          },
          {
            name: "Women's Clothing",
            slug: 'womens-clothing',
            description: 'Clothing for women',
            children: [
              { name: 'Dresses', slug: 'womens-dresses', description: 'All types of dresses' },
              { name: 'Tops & Blouses', slug: 'womens-tops-blouses', description: 'Upper body garments' },
              { name: 'T-Shirts', slug: 'womens-t-shirts', description: 'Casual tops' },
              { name: 'Pants & Trousers', slug: 'womens-pants-trousers', description: 'Lower body garments' },
              { name: 'Jeans', slug: 'womens-jeans', description: 'Denim pants' },
              { name: 'Skirts', slug: 'womens-skirts', description: 'All types of skirts' },
              { name: 'Suits & Blazers', slug: 'womens-suits-blazers', description: 'Formal wear' },
              { name: 'Jackets & Coats', slug: 'womens-jackets-coats', description: 'Outerwear' },
              { name: 'Sweaters & Cardigans', slug: 'womens-sweaters-cardigans', description: 'Knitwear' },
              { name: 'Activewear', slug: 'womens-activewear', description: 'Athletic clothing' },
              { name: 'Lingerie', slug: 'womens-lingerie', description: 'Undergarments' },
              { name: 'Sleepwear', slug: 'womens-sleepwear', description: 'Pajamas and loungewear' },
              { name: 'Swimwear', slug: 'womens-swimwear', description: 'Swimming attire' }
            ]
          },
          {
            name: "Kids' Clothing",
            slug: 'kids-clothing',
            description: 'Clothing for children',
            children: [
              { name: "Boys' Clothing", slug: 'boys-clothing', description: 'Clothing for boys' },
              { name: "Girls' Clothing", slug: 'girls-clothing', description: 'Clothing for girls' },
              { name: 'Baby Clothing', slug: 'baby-clothing', description: 'Clothing for infants' },
              { name: 'School Uniforms', slug: 'school-uniforms', description: 'Educational institution wear' },
              { name: "Kids' Activewear", slug: 'kids-activewear', description: 'Athletic clothing for children' },
              { name: "Kids' Swimwear", slug: 'kids-swimwear', description: 'Swimming attire for children' }
            ]
          },
          {
            name: 'Footwear',
            slug: 'footwear',
            description: 'Shoes and footwear',
            children: [
              { name: "Men's Shoes", slug: 'mens-shoes', description: 'Footwear for men' },
              { name: "Women's Shoes", slug: 'womens-shoes', description: 'Footwear for women' },
              { name: "Kids' Shoes", slug: 'kids-shoes', description: 'Footwear for children' },
              { name: 'Sports Shoes', slug: 'sports-shoes', description: 'Athletic footwear' },
              { name: 'Formal Shoes', slug: 'formal-shoes', description: 'Dress shoes' },
              { name: 'Casual Shoes', slug: 'casual-shoes', description: 'Everyday footwear' },
              { name: 'Sandals & Slippers', slug: 'sandals-slippers', description: 'Open footwear' }
            ]
          },
          {
            name: 'Fashion Accessories',
            slug: 'fashion-accessories',
            description: 'Accessories for clothing',
            children: [
              { name: 'Belts', slug: 'belts', description: 'Waist belts' },
              { name: 'Wallets', slug: 'wallets', description: 'Money holders' },
              { name: 'Hats & Caps', slug: 'hats-caps', description: 'Headwear' },
              { name: 'Scarves & Wraps', slug: 'scarves-wraps', description: 'Neck wear' },
              { name: 'Gloves', slug: 'gloves', description: 'Hand wear' },
              { name: 'Sunglasses', slug: 'sunglasses', description: 'Eye wear' },
              { name: 'Hair Accessories', slug: 'hair-accessories', description: 'Hair decoration' }
            ]
          },
          {
            name: 'Jewelry & Watches',
            slug: 'jewelry-watches',
            description: 'Jewelry and timepieces',
            children: [
              {
                name: 'Fine Jewelry',
                slug: 'fine-jewelry',
                description: 'Precious jewelry pieces',
                children: [
                  { name: 'Diamond Jewelry', slug: 'diamond-jewelry', description: 'Diamond pieces' },
                  { name: 'Gold Jewelry', slug: 'gold-jewelry', description: 'Gold pieces' },
                  { name: 'Silver Jewelry', slug: 'silver-jewelry', description: 'Silver pieces' },
                  { name: 'Gemstone Jewelry', slug: 'gemstone-jewelry', description: 'Precious gemstone pieces' }
                ]
              },
              {
                name: 'Fashion Jewelry',
                slug: 'fashion-jewelry',
                description: 'Costume and fashion jewelry',
                children: [
                  { name: 'Necklaces', slug: 'fashion-necklaces', description: 'Fashion neckwear' },
                  { name: 'Earrings', slug: 'fashion-earrings', description: 'Fashion ear jewelry' },
                  { name: 'Bracelets', slug: 'fashion-bracelets', description: 'Fashion wrist wear' },
                  { name: 'Rings', slug: 'fashion-rings', description: 'Fashion finger jewelry' }
                ]
              },
              {
                name: 'Watches',
                slug: 'watches',
                description: 'Timepieces and accessories',
                children: [
                  { name: 'Luxury Watches', slug: 'luxury-watches', description: 'High-end timepieces' },
                  { name: 'Fashion Watches', slug: 'fashion-watches', description: 'Trendy timepieces' },
                  { name: 'Sports Watches', slug: 'sports-watches', description: 'Athletic timepieces' },
                  { name: 'Watch Accessories', slug: 'watch-accessories', description: 'Watch straps and tools' }
                ]
              }
            ]
          },
          {
            name: 'Bags & Luggage',
            slug: 'bags-luggage',
            description: 'Carrying accessories and travel gear',
            children: [
              { name: 'Handbags', slug: 'handbags', description: 'Women\'s bags' },
              { name: 'Backpacks', slug: 'backpacks', description: 'Back-carried bags' },
              { name: 'Briefcases', slug: 'briefcases', description: 'Business bags' },
              { name: 'Luggage', slug: 'luggage', description: 'Travel bags' },
              { name: 'Travel Accessories', slug: 'travel-accessories', description: 'Travel-related items' },
              { name: 'Wallets & Cardholders', slug: 'wallets-cardholders', description: 'Money and card storage' }
            ]
          }
        ]
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Home furnishings and household items',
        children: [
          {
            name: 'Furniture',
            slug: 'furniture',
            description: 'Home and office furniture',
            children: [
              {
                name: 'Living Room',
                slug: 'living-room-furniture',
                description: 'Living room furnishings',
                children: [
                  { name: 'Sofas & Couches', slug: 'sofas-couches', description: 'Seating furniture' },
                  { name: 'Coffee Tables', slug: 'coffee-tables', description: 'Center tables' },
                  { name: 'TV Stands', slug: 'tv-stands', description: 'Entertainment units' },
                  { name: 'Bookcases', slug: 'bookcases', description: 'Book storage' }
                ]
              },
              {
                name: 'Bedroom',
                slug: 'bedroom-furniture',
                description: 'Bedroom furnishings',
                children: [
                  { name: 'Beds', slug: 'beds', description: 'Sleeping furniture' },
                  { name: 'Mattresses', slug: 'mattresses', description: 'Sleep surfaces' },
                  { name: 'Dressers', slug: 'dressers', description: 'Clothing storage' },
                  { name: 'Nightstands', slug: 'nightstands', description: 'Bedside tables' }
                ]
              },
              {
                name: 'Dining Room',
                slug: 'dining-room-furniture',
                description: 'Dining room furnishings',
                children: [
                  { name: 'Dining Tables', slug: 'dining-tables', description: 'Eating surfaces' },
                  { name: 'Dining Chairs', slug: 'dining-chairs', description: 'Dining seating' },
                  { name: 'Buffets & Sideboards', slug: 'buffets-sideboards', description: 'Storage furniture' }
                ]
              },
              {
                name: 'Office',
                slug: 'office-furniture',
                description: 'Office furnishings',
                children: [
                  { name: 'Desks', slug: 'desks', description: 'Work surfaces' },
                  { name: 'Office Chairs', slug: 'office-chairs', description: 'Work seating' },
                  { name: 'Filing Cabinets', slug: 'filing-cabinets', description: 'Document storage' }
                ]
              }
            ]
          },
          {
            name: 'Home Decor',
            slug: 'home-decor',
            description: 'Decorative items for home',
            children: [
              { name: 'Wall Art', slug: 'wall-art', description: 'Wall decorations' },
              { name: 'Mirrors', slug: 'mirrors', description: 'Reflective decor' },
              { name: 'Clocks', slug: 'clocks', description: 'Time pieces' },
              { name: 'Vases', slug: 'vases', description: 'Decorative containers' },
              { name: 'Candles & Holders', slug: 'candles-holders', description: 'Lighting decor' },
              { name: 'Photo Frames', slug: 'photo-frames', description: 'Picture display' },
              { name: 'Artificial Plants', slug: 'artificial-plants', description: 'Faux botanicals' }
            ]
          },
          {
            name: 'Kitchen & Dining',
            slug: 'kitchen-dining',
            description: 'Kitchen and dining items',
            children: [
              {
                name: 'Cookware',
                slug: 'cookware',
                description: 'Cooking equipment',
                children: [
                  { name: 'Pots & Pans', slug: 'pots-pans', description: 'Cooking vessels' },
                  { name: 'Bakeware', slug: 'bakeware', description: 'Baking equipment' },
                  { name: 'Cooking Utensils', slug: 'cooking-utensils', description: 'Kitchen tools' }
                ]
              },
              {
                name: 'Dinnerware',
                slug: 'dinnerware',
                description: 'Eating vessels',
                children: [
                  { name: 'Plates', slug: 'plates', description: 'Eating surfaces' },
                  { name: 'Bowls', slug: 'bowls', description: 'Serving vessels' },
                  { name: 'Cups & Mugs', slug: 'cups-mugs', description: 'Drinking vessels' }
                ]
              },
              {
                name: 'Kitchen Appliances',
                slug: 'kitchen-appliances',
                description: 'Electric kitchen equipment',
                children: [
                  { name: 'Blenders', slug: 'blenders', description: 'Mixing appliances' },
                  { name: 'Coffee Makers', slug: 'coffee-makers', description: 'Coffee brewing' },
                  { name: 'Toasters', slug: 'toasters', description: 'Bread heating' },
                  { name: 'Microwaves', slug: 'microwaves', description: 'Microwave ovens' }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Beauty, cosmetics, and personal care products',
        children: [
          {
            name: 'Skincare',
            slug: 'skincare',
            description: 'Skin treatment and care products',
            children: [
              { name: 'Cleansers', slug: 'facial-cleansers', description: 'Face cleaning products' },
              { name: 'Moisturizers', slug: 'moisturizers', description: 'Hydrating products' },
              { name: 'Serums & Treatments', slug: 'serums-treatments', description: 'Concentrated skincare' },
              { name: 'Eye Care', slug: 'eye-care', description: 'Eye area treatments' },
              { name: 'Face Masks', slug: 'face-masks', description: 'Facial treatments' },
              { name: 'Sun Protection', slug: 'sun-protection', description: 'Sunscreen and sun care' },
              { name: 'Lip Care', slug: 'lip-care', description: 'Lip treatment products' },
              { name: 'Body Care', slug: 'body-care', description: 'Body treatment products' },
              { name: 'Hand Care', slug: 'hand-care', description: 'Hand treatment products' }
            ]
          },
          {
            name: 'Makeup',
            slug: 'makeup',
            description: 'Cosmetic products',
            children: [
              { name: 'Face Makeup', slug: 'face-makeup', description: 'Foundation and face products' },
              { name: 'Eye Makeup', slug: 'eye-makeup', description: 'Eye cosmetics' },
              { name: 'Lip Makeup', slug: 'lip-makeup', description: 'Lip cosmetics' },
              { name: 'Makeup Sets', slug: 'makeup-sets', description: 'Cosmetic collections' },
              { name: 'Makeup Tools', slug: 'makeup-tools', description: 'Application tools' },
              { name: 'Makeup Removers', slug: 'makeup-removers', description: 'Cleansing products' }
            ]
          },
          {
            name: 'Hair Care',
            slug: 'hair-care',
            description: 'Hair treatment and styling products',
            children: [
              { name: 'Shampoo', slug: 'shampoo', description: 'Hair cleansing' },
              { name: 'Conditioner', slug: 'conditioner', description: 'Hair conditioning' },
              { name: 'Hair Treatments', slug: 'hair-treatments', description: 'Hair repair products' },
              { name: 'Hair Styling', slug: 'hair-styling', description: 'Styling products' },
              { name: 'Hair Color', slug: 'hair-color', description: 'Hair dyes and colors' },
              { name: 'Hair Tools', slug: 'hair-tools', description: 'Styling tools' }
            ]
          },
          {
            name: 'Fragrances',
            slug: 'fragrances',
            description: 'Perfumes and scents',
            children: [
              { name: "Men's Perfume", slug: 'mens-perfume', description: 'Fragrances for men' },
              { name: "Women's Perfume", slug: 'womens-perfume', description: 'Fragrances for women' },
              { name: 'Unisex Fragrances', slug: 'unisex-fragrances', description: 'Gender-neutral scents' },
              { name: 'Body Sprays', slug: 'body-sprays', description: 'Light fragrances' },
              { name: 'Gift Sets', slug: 'fragrance-sets', description: 'Fragrance collections' }
            ]
          },
          {
            name: 'Personal Care',
            slug: 'personal-care',
            description: 'Personal hygiene products',
            children: [
              { name: 'Oral Care', slug: 'oral-care', description: 'Dental hygiene' },
              { name: 'Deodorants', slug: 'deodorants', description: 'Body fresheners' },
              { name: 'Bath & Body', slug: 'bath-body', description: 'Bathing products' },
              { name: 'Feminine Care', slug: 'feminine-care', description: 'Female hygiene' },
              { name: "Men's Grooming", slug: 'mens-grooming', description: 'Male grooming' },
              { name: 'Hand Sanitizers', slug: 'hand-sanitizers', description: 'Hand hygiene' }
            ]
          }
        ]
      },
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Health and wellness products',
        children: [
          {
            name: 'Vitamins & Supplements',
            slug: 'vitamins-supplements',
            description: 'Nutritional supplements',
            children: [
              { name: 'Multivitamins', slug: 'multivitamins', description: 'Complete vitamins' },
              { name: 'Minerals', slug: 'minerals', description: 'Mineral supplements' },
              { name: 'Herbal Supplements', slug: 'herbal-supplements', description: 'Natural supplements' },
              { name: 'Sports Nutrition', slug: 'sports-nutrition', description: 'Athletic supplements' },
              { name: 'Weight Management', slug: 'weight-management', description: 'Diet supplements' }
            ]
          },
          {
            name: 'Medical Supplies',
            slug: 'medical-supplies',
            description: 'Healthcare products',
            children: [
              { name: 'First Aid', slug: 'first-aid', description: 'Emergency care' },
              { name: 'Health Monitors', slug: 'health-monitors', description: 'Medical monitoring' },
              { name: 'Mobility Aids', slug: 'mobility-aids', description: 'Movement assistance' },
              { name: 'Support Braces', slug: 'support-braces', description: 'Body support' },
              { name: 'Medical Equipment', slug: 'medical-equipment', description: 'Healthcare equipment' }
            ]
          },
          {
            name: 'Vision Care',
            slug: 'vision-care',
            description: 'Eye care products',
            children: [
              { name: 'Reading Glasses', slug: 'reading-glasses', description: 'Vision assistance' },
              { name: 'Contact Lenses', slug: 'contact-lenses', description: 'Vision correction' },
              { name: 'Eye Drops', slug: 'eye-drops', description: 'Eye treatment' },
              { name: 'Lens Care', slug: 'lens-care', description: 'Contact maintenance' }
            ]
          },
          {
            name: 'Alternative Medicine',
            slug: 'alternative-medicine',
            description: 'Natural remedies',
            children: [
              { name: 'Aromatherapy', slug: 'aromatherapy', description: 'Essential oils' },
              { name: 'Traditional Medicine', slug: 'traditional-medicine', description: 'Cultural remedies' },
              { name: 'Homeopathy', slug: 'homeopathy', description: 'Homeopathic remedies' },
              { name: 'Acupuncture', slug: 'acupuncture', description: 'Acupuncture supplies' }
            ]
          }
        ]
      },
      {
        name: 'Sports & Outdoor',
        slug: 'sports-outdoor',
        description: 'Sports equipment and outdoor gear',
        children: [
          {
            name: 'Exercise & Fitness',
            slug: 'exercise-fitness',
            description: 'Fitness equipment',
            children: [
              { name: 'Cardio Equipment', slug: 'cardio-equipment', description: 'Cardiovascular training' },
              { name: 'Strength Training', slug: 'strength-training', description: 'Weight training' },
              { name: 'Yoga & Pilates', slug: 'yoga-pilates', description: 'Mind-body exercise' },
              { name: 'Fitness Accessories', slug: 'fitness-accessories', description: 'Exercise accessories' },
              { name: 'Recovery & Massage', slug: 'recovery-massage', description: 'Post-workout recovery' }
            ]
          },
          {
            name: 'Team Sports',
            slug: 'team-sports',
            description: 'Group sports equipment',
            children: [
              { name: 'Football', slug: 'football', description: 'Football equipment' },
              { name: 'Basketball', slug: 'basketball', description: 'Basketball equipment' },
              { name: 'Soccer', slug: 'soccer', description: 'Soccer equipment' },
              { name: 'Volleyball', slug: 'volleyball', description: 'Volleyball equipment' },
              { name: 'Cricket', slug: 'cricket', description: 'Cricket equipment' }
            ]
          },
          {
            name: 'Outdoor Recreation',
            slug: 'outdoor-recreation',
            description: 'Outdoor activities gear',
            children: [
              { name: 'Camping', slug: 'camping', description: 'Camping gear' },
              { name: 'Hiking', slug: 'hiking', description: 'Hiking equipment' },
              { name: 'Cycling', slug: 'cycling', description: 'Cycling gear' },
              { name: 'Water Sports', slug: 'water-sports', description: 'Water activities' },
              { name: 'Fishing', slug: 'fishing', description: 'Fishing equipment' }
            ]
          }
        ]
      },
      {
        name: 'Automotive & Tools',
        slug: 'automotive-tools',
        description: 'Automotive parts, tools, and equipment',
        children: [
          {
            name: 'Auto Parts',
            slug: 'auto-parts',
            description: 'Vehicle replacement parts',
            children: [
              { name: 'Engine Parts', slug: 'engine-parts', description: 'Engine components' },
              { name: 'Transmission', slug: 'transmission', description: 'Transmission parts' },
              { name: 'Brake System', slug: 'brake-system', description: 'Braking components' },
              { name: 'Suspension', slug: 'suspension', description: 'Suspension parts' },
              { name: 'Electrical Parts', slug: 'electrical-parts', description: 'Electrical components' },
              { name: 'Exhaust System', slug: 'exhaust-system', description: 'Exhaust components' },
              { name: 'Filters', slug: 'filters', description: 'Vehicle filters' },
              { name: 'Body Parts', slug: 'body-parts', description: 'External components' }
            ]
          },
          {
            name: 'Auto Accessories',
            slug: 'auto-accessories',
            description: 'Vehicle accessories',
            children: [
              { name: 'Interior Accessories', slug: 'interior-accessories', description: 'Cabin accessories' },
              { name: 'Exterior Accessories', slug: 'exterior-accessories', description: 'External accessories' },
              { name: 'Car Electronics', slug: 'car-electronics', description: 'Vehicle electronics' },
              { name: 'Car Care', slug: 'car-care', description: 'Cleaning and maintenance' },
              { name: 'Car Security', slug: 'car-security', description: 'Security systems' }
            ]
          },
          {
            name: 'Tools',
            slug: 'tools',
            description: 'Hand and power tools',
            children: [
              {
                name: 'Hand Tools',
                slug: 'hand-tools',
                description: 'Manual tools',
                children: [
                  { name: 'Screwdrivers', slug: 'screwdrivers', description: 'Manual driving tools' },
                  { name: 'Wrenches', slug: 'wrenches', description: 'Turning tools' },
                  { name: 'Hammers', slug: 'hammers', description: 'Impact tools' },
                  { name: 'Pliers', slug: 'pliers', description: 'Gripping tools' },
                  { name: 'Measuring Tools', slug: 'measuring-tools', description: 'Measurement devices' }
                ]
              },
              {
                name: 'Power Tools',
                slug: 'power-tools',
                description: 'Electric tools',
                children: [
                  { name: 'Drills', slug: 'drills', description: 'Drilling tools' },
                  { name: 'Saws', slug: 'saws', description: 'Cutting tools' },
                  { name: 'Sanders', slug: 'sanders', description: 'Sanding tools' },
                  { name: 'Grinders', slug: 'grinders', description: 'Grinding tools' }
                ]
              },
              {
                name: 'Tool Storage',
                slug: 'tool-storage',
                description: 'Tool organization',
                children: [
                  { name: 'Tool Boxes', slug: 'tool-boxes', description: 'Portable storage' },
                  { name: 'Tool Cabinets', slug: 'tool-cabinets', description: 'Stationary storage' },
                  { name: 'Tool Bags', slug: 'tool-bags', description: 'Soft storage' }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Books & Entertainment',
        slug: 'books-entertainment',
        description: 'Books, music, and entertainment items',
        children: [
          {
            name: 'Books',
            slug: 'books',
            description: 'Printed and digital books',
            children: [
              { name: 'Fiction', slug: 'fiction', description: 'Fiction books' },
              { name: 'Non-Fiction', slug: 'non-fiction', description: 'Non-fiction books' },
              { name: 'Children\'s Books', slug: 'childrens-books', description: 'Books for children' },
              { name: 'Textbooks', slug: 'textbooks', description: 'Educational books' },
              { name: 'Religious Books', slug: 'religious-books', description: 'Religious texts' },
              { name: 'Comics & Manga', slug: 'comics-manga', description: 'Graphic novels' }
            ]
          },
          {
            name: 'Music',
            slug: 'music',
            description: 'Musical instruments and equipment',
            children: [
              { name: 'String Instruments', slug: 'string-instruments', description: 'Stringed instruments' },
              { name: 'Percussion', slug: 'percussion', description: 'Percussion instruments' },
              { name: 'Wind Instruments', slug: 'wind-instruments', description: 'Wind instruments' },
              { name: 'Electronic Instruments', slug: 'electronic-instruments', description: 'Digital instruments' },
              { name: 'Music Accessories', slug: 'music-accessories', description: 'Musical accessories' }
            ]
          },
          {
            name: 'Movies & TV',
            slug: 'movies-tv',
            description: 'Film and television media',
            children: [
              { name: 'Movies', slug: 'movies', description: 'Films' },
              { name: 'TV Series', slug: 'tv-series', description: 'Television shows' },
              { name: 'Documentaries', slug: 'documentaries', description: 'Documentary films' },
              { name: 'Educational Videos', slug: 'educational-videos', description: 'Learning media' }
            ]
          }
        ]
      },
      {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Toys, games, and recreational items',
        children: [
          {
            name: 'Toys by Age',
            slug: 'toys-by-age',
            description: 'Age-appropriate toys',
            children: [
              { name: 'Baby Toys', slug: 'baby-toys', description: 'Toys for infants' },
              { name: 'Toddler Toys', slug: 'toddler-toys', description: 'Toys for toddlers' },
              { name: 'Kids Toys', slug: 'kids-toys', description: 'Toys for children' },
              { name: 'Teen Toys', slug: 'teen-toys', description: 'Toys for teenagers' }
            ]
          },
          {
            name: 'Games',
            slug: 'games',
            description: 'Games and puzzles',
            children: [
              { name: 'Board Games', slug: 'board-games', description: 'Tabletop games' },
              { name: 'Card Games', slug: 'card-games', description: 'Playing cards' },
              { name: 'Puzzles', slug: 'puzzles', description: 'Jigsaw puzzles' },
              { name: 'Educational Games', slug: 'educational-games', description: 'Learning games' }
            ]
          },
          {
            name: 'Outdoor Toys',
            slug: 'outdoor-toys',
            description: 'Outdoor play equipment',
            children: [
              { name: 'Sports Toys', slug: 'sports-toys', description: 'Athletic toys' },
              { name: 'Ride-On Toys', slug: 'ride-on-toys', description: 'Riding toys' },
              { name: 'Water Toys', slug: 'water-toys', description: 'Water play items' },
              { name: 'Outdoor Games', slug: 'outdoor-games', description: 'Outdoor activities' }
            ]
          }
        ]
      },
      {
        name: 'Pet Supplies',
        slug: 'pet-supplies',
        description: 'Products for pets and animals',
        children: [
          {
            name: 'Dog Supplies',
            slug: 'dog-supplies',
            description: 'Products for dogs',
            children: [
              { name: 'Dog Food', slug: 'dog-food', description: 'Dog nutrition' },
              { name: 'Dog Treats', slug: 'dog-treats', description: 'Dog snacks and rewards' },
              { name: 'Dog Toys', slug: 'dog-toys', description: 'Dog play items' },
              { name: 'Dog Beds', slug: 'dog-beds', description: 'Dog sleeping furniture' },
              { name: 'Dog Grooming', slug: 'dog-grooming', description: 'Dog care products' },
              { name: 'Dog Health', slug: 'dog-health', description: 'Dog healthcare' },
              { name: 'Dog Collars & Leashes', slug: 'dog-collars-leashes', description: 'Dog walking gear' },
              { name: 'Dog Clothing', slug: 'dog-clothing', description: 'Dog apparel' },
              { name: 'Dog Carriers', slug: 'dog-carriers', description: 'Dog transport' }
            ]
          },
          {
            name: 'Cat Supplies',
            slug: 'cat-supplies',
            description: 'Products for cats',
            children: [
              { name: 'Cat Food', slug: 'cat-food', description: 'Cat nutrition' },
              { name: 'Cat Treats', slug: 'cat-treats', description: 'Cat snacks' },
              { name: 'Cat Toys', slug: 'cat-toys', description: 'Cat play items' },
              { name: 'Cat Beds', slug: 'cat-beds', description: 'Cat furniture' },
              { name: 'Cat Grooming', slug: 'cat-grooming', description: 'Cat care products' },
              { name: 'Cat Health', slug: 'cat-health', description: 'Cat healthcare' },
              { name: 'Litter & Accessories', slug: 'cat-litter', description: 'Cat sanitation' },
              { name: 'Cat Carriers', slug: 'cat-carriers', description: 'Cat transport' }
            ]
          },
          {
            name: 'Fish & Aquarium',
            slug: 'fish-aquarium',
            description: 'Aquatic pet supplies',
            children: [
              { name: 'Fish Food', slug: 'fish-food', description: 'Fish nutrition' },
              { name: 'Aquariums', slug: 'aquariums', description: 'Fish tanks' },
              { name: 'Water Treatment', slug: 'water-treatment', description: 'Aquarium maintenance' },
              { name: 'Filters & Pumps', slug: 'filters-pumps', description: 'Water filtration' },
              { name: 'Aquarium Decor', slug: 'aquarium-decor', description: 'Tank decoration' }
            ]
          },
          {
            name: 'Bird Supplies',
            slug: 'bird-supplies',
            description: 'Products for birds',
            children: [
              { name: 'Bird Food', slug: 'bird-food', description: 'Bird nutrition' },
              { name: 'Bird Cages', slug: 'bird-cages', description: 'Bird housing' },
              { name: 'Bird Toys', slug: 'bird-toys', description: 'Bird enrichment' },
              { name: 'Bird Health', slug: 'bird-health', description: 'Bird healthcare' }
            ]
          },
          {
            name: 'Small Pet Supplies',
            slug: 'small-pet-supplies',
            description: 'Products for small animals',
            children: [
              { name: 'Small Animal Food', slug: 'small-animal-food', description: 'Small pet nutrition' },
              { name: 'Habitats & Cages', slug: 'habitats-cages', description: 'Small pet housing' },
              { name: 'Bedding & Litter', slug: 'bedding-litter', description: 'Cage maintenance' },
              { name: 'Small Pet Toys', slug: 'small-pet-toys', description: 'Small pet enrichment' }
            ]
          }
        ]
      },
      {
        name: 'Food & Beverages',
        slug: 'food-beverages',
        description: 'Food and drink products',
        children: [
          {
            name: 'Pantry',
            slug: 'pantry',
            description: 'Shelf-stable foods',
            children: [
              { name: 'Grains & Pasta', slug: 'grains-pasta', description: 'Dry staples' },
              { name: 'Canned Goods', slug: 'canned-goods', description: 'Preserved foods' },
              { name: 'Snacks', slug: 'snacks', description: 'Snack foods' },
              { name: 'Baking', slug: 'baking', description: 'Baking supplies' },
              { name: 'Condiments & Sauces', slug: 'condiments-sauces', description: 'Food enhancers' },
              { name: 'Cooking Oils', slug: 'cooking-oils', description: 'Cooking fats' },
              { name: 'Seasonings', slug: 'seasonings', description: 'Spices and herbs' }
            ]
          },
          {
            name: 'Beverages',
            slug: 'beverages',
            description: 'Drinks and drink mixes',
            children: [
              { name: 'Coffee', slug: 'coffee', description: 'Coffee products' },
              { name: 'Tea', slug: 'tea', description: 'Tea products' },
              { name: 'Soft Drinks', slug: 'soft-drinks', description: 'Carbonated beverages' },
              { name: 'Juices', slug: 'juices', description: 'Fruit beverages' },
              { name: 'Water', slug: 'water', description: 'Drinking water' },
              { name: 'Energy Drinks', slug: 'energy-drinks', description: 'Caffeinated beverages' }
            ]
          },
          {
            name: 'Specialty Foods',
            slug: 'specialty-foods',
            description: 'Gourmet and special diet foods',
            children: [
              { name: 'Organic Foods', slug: 'organic-foods', description: 'Organic products' },
              { name: 'Gluten-Free', slug: 'gluten-free', description: 'Gluten-free products' },
              { name: 'Vegan Foods', slug: 'vegan-foods', description: 'Plant-based products' },
              { name: 'Halal Foods', slug: 'halal-foods', description: 'Halal-certified products' },
              { name: 'Kosher Foods', slug: 'kosher-foods', description: 'Kosher-certified products' }
            ]
          }
        ]
      },
      {
        name: 'Office & School Supplies',
        slug: 'office-school-supplies',
        description: 'Office and educational supplies',
        children: [
          {
            name: 'Writing Supplies',
            slug: 'writing-supplies',
            description: 'Writing instruments and accessories',
            children: [
              { name: 'Pens', slug: 'pens', description: 'Writing pens' },
              { name: 'Pencils', slug: 'pencils', description: 'Writing pencils' },
              { name: 'Markers', slug: 'markers', description: 'Marking tools' },
              { name: 'Highlighters', slug: 'highlighters', description: 'Highlighting tools' }
            ]
          },
          {
            name: 'Paper Products',
            slug: 'paper-products',
            description: 'Paper-based supplies',
            children: [
              { name: 'Notebooks', slug: 'notebooks', description: 'Writing books' },
              { name: 'Printing Paper', slug: 'printing-paper', description: 'Printer supplies' },
              { name: 'Sticky Notes', slug: 'sticky-notes', description: 'Adhesive notes' },
              { name: 'Planners', slug: 'planners', description: 'Planning tools' },
              { name: 'Envelopes', slug: 'envelopes', description: 'Mailing supplies' }
            ]
          },
          {
            name: 'Office Equipment',
            slug: 'office-equipment',
            description: 'Office machinery and tools',
            children: [
              { name: 'Calculators', slug: 'calculators', description: 'Computing devices' },
              { name: 'Shredders', slug: 'shredders', description: 'Paper destruction' },
              { name: 'Laminators', slug: 'laminators', description: 'Document protection' },
              { name: 'Binding Supplies', slug: 'binding-supplies', description: 'Document binding' }
            ]
          },
          {
            name: 'School Supplies',
            slug: 'school-supplies',
            description: 'Educational materials',
            children: [
              { name: 'Art Supplies', slug: 'art-supplies', description: 'Creative materials' },
              { name: 'Backpacks', slug: 'school-backpacks', description: 'School bags' },
              { name: 'Lunch Boxes', slug: 'lunch-boxes', description: 'Food storage' },
              { name: 'Educational Materials', slug: 'educational-materials', description: 'Learning supplies' }
            ]
          }
        ]
      },
      {
        name: 'Arts & Crafts',
        slug: 'arts-crafts',
        description: 'Art supplies and craft materials',
        children: [
          {
            name: 'Drawing',
            slug: 'drawing',
            description: 'Drawing supplies',
            children: [
              { name: 'Pencils & Charcoal', slug: 'drawing-pencils', description: 'Drawing implements' },
              { name: 'Drawing Pads', slug: 'drawing-pads', description: 'Drawing surfaces' },
              { name: 'Drawing Accessories', slug: 'drawing-accessories', description: 'Drawing tools' },
              { name: 'Technical Drawing', slug: 'technical-drawing', description: 'Precision drawing' }
            ]
          },
          {
            name: 'Painting',
            slug: 'painting',
            description: 'Painting supplies',
            children: [
              { name: 'Acrylic Paint', slug: 'acrylic-paint', description: 'Acrylic supplies' },
              { name: 'Oil Paint', slug: 'oil-paint', description: 'Oil painting supplies' },
              { name: 'Watercolor', slug: 'watercolor', description: 'Watercolor supplies' },
              { name: 'Canvas', slug: 'canvas', description: 'Painting surfaces' },
              { name: 'Brushes', slug: 'paint-brushes', description: 'Painting tools' }
            ]
          },
          {
            name: 'Crafting',
            slug: 'crafting',
            description: 'Craft supplies',
            children: [
              { name: 'Scrapbooking', slug: 'scrapbooking', description: 'Memory craft' },
              { name: 'Jewelry Making', slug: 'jewelry-making', description: 'Jewelry crafts' },
              { name: 'Sewing', slug: 'sewing', description: 'Sewing supplies' },
              { name: 'Knitting & Crochet', slug: 'knitting-crochet', description: 'Yarn crafts' },
              { name: 'Paper Crafts', slug: 'paper-crafts', description: 'Paper arts' }
            ]
          },
          {
            name: 'Art Tools',
            slug: 'art-tools',
            description: 'Creative tools',
            children: [
              { name: 'Cutting Tools', slug: 'cutting-tools', description: 'Precision cutters' },
              { name: 'Adhesives', slug: 'adhesives', description: 'Glues and tapes' },
              { name: 'Storage & Organization', slug: 'art-storage', description: 'Supply organization' },
              { name: 'Art Accessories', slug: 'art-accessories', description: 'Creative accessories' }
            ]
          }
        ]
      }
    ];
  }
}