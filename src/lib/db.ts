import { Product, Category, PromotionalBanner, HomepageSection, Order, Coupon, User, SellerInfo } from "./types";

// ==========================================
// SEED CATEGORIES
// ==========================================
export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-mobiles",
    name: "Mobiles & Tablets",
    slug: "mobiles",
    icon: "Smartphone",
    subcategories: [
      { name: "All Mobile Phones", slug: "all-mobiles", popularItems: ["Apple", "Samsung", "Nothing", "OnePlus", "Realme"] },
      { name: "Tablets & iPads", slug: "tablets", popularItems: ["iPad Pro", "Samsung Tab S9", "Xiaomi Pad"] },
      { name: "Mobile Accessories", slug: "mobile-accessories", popularItems: ["Cases & Covers", "Fast Chargers", "Screen Protectors"] },
      { name: "Smart Wearables", slug: "smart-wearables", popularItems: ["Apple Watch", "Galaxy Watch", "Fitness Bands"] },
    ],
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "Laptop",
    subcategories: [
      { name: "Laptops", slug: "laptops", popularItems: ["Gaming Laptops", "Thin & Light", "MacBooks"] },
      { name: "Audio & Headphones", slug: "audio", popularItems: ["Noise Cancelling", "True Wireless", "Bluetooth Speakers"] },
      { name: "Cameras & Accessories", slug: "cameras", popularItems: ["DSLR", "Mirrorless", "Action Cameras"] },
      { name: "Computer Accessories", slug: "computer-accessories", popularItems: ["Monitors", "Keyboards & Mice", "External SSDs"] },
    ],
  },
  {
    id: "cat-appliances",
    name: "TVs & Appliances",
    slug: "appliances",
    icon: "Tv",
    subcategories: [
      { name: "Televisions", slug: "televisions", popularItems: ["OLED 4K TVs", "QLED TVs", "Smart Android TVs"] },
      { name: "Air Conditioners", slug: "air-conditioners", popularItems: ["Split ACs", "Inverter ACs", "1.5 Ton ACs"] },
      { name: "Refrigerators", slug: "refrigerators", popularItems: ["Double Door", "Side by Side", "Frost Free"] },
      { name: "Washing Machines", slug: "washing-machines", popularItems: ["Front Load", "Top Load Fully Automatic"] },
      { name: "Kitchen Appliances", slug: "kitchen-appliances", popularItems: ["Air Fryers", "Microwave Ovens", "Mixer Grinders"] },
    ],
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    subcategories: [
      { name: "Men's Top Wear", slug: "mens-top-wear", popularItems: ["T-Shirts", "Casual Shirts", "Jackets"] },
      { name: "Men's Bottom Wear", slug: "mens-bottom-wear", popularItems: ["Jeans", "Trousers", "Cargo Pants"] },
      { name: "Women's Ethnic", slug: "womens-ethnic", popularItems: ["Kurtas & Kurtis", "Sarees", "Anarkalis"] },
      { name: "Footwear", slug: "footwear", popularItems: ["Sneakers", "Running Shoes", "Formal Shoes"] },
      { name: "Watches & Accessories", slug: "fashion-accessories", popularItems: ["Chronographs", "Sunglasses", "Leather Belts"] },
    ],
  },
  {
    id: "cat-beauty",
    name: "Beauty, Toys & More",
    slug: "beauty",
    icon: "Sparkles",
    subcategories: [
      { name: "Luxury Skincare", slug: "skincare", popularItems: ["Serums", "Moisturizers", "Sunscreen"] },
      { name: "Fragrances & Perfumes", slug: "fragrances", popularItems: ["Eau De Parfum", "Body Mists", "Attars"] },
      { name: "Men's Grooming", slug: "grooming", popularItems: ["Beard Care", "Trimmers", "Shaving Kits"] },
      { name: "Toys & Board Games", slug: "toys", popularItems: ["Remote Control", "STEM Toys", "Puzzles"] },
    ],
  },
  {
    id: "cat-home",
    name: "Home & Furniture",
    slug: "home-furniture",
    icon: "Armchair",
    subcategories: [
      { name: "Living Room Furniture", slug: "living-room", popularItems: ["Sofas", "Recliners", "Coffee Tables"] },
      { name: "Bedroom Furniture", slug: "bedroom", popularItems: ["Beds", "Mattresses", "Wardrobes"] },
      { name: "Work & Study", slug: "office-furniture", popularItems: ["Ergonomic Chairs", "Study Desks"] },
      { name: "Home Decor", slug: "home-decor", popularItems: ["Wall Clocks", "Lamps & Lighting", "Curtains"] },
    ],
  },
  {
    id: "cat-grocery",
    name: "Grocery",
    slug: "grocery",
    icon: "ShoppingBasket",
    subcategories: [
      { name: "Staples & Pulses", slug: "staples", popularItems: ["Basmati Rice", "Atta", "Cold Pressed Oils"] },
      { name: "Dry Fruits & Nuts", slug: "dry-fruits", popularItems: ["Almonds", "Cashews", "Walnuts"] },
      { name: "Beverages", slug: "beverages", popularItems: ["Organic Green Tea", "Artisan Coffee", "Juices"] },
    ],
  },
];

// ==========================================
// SEED SELLERS
// ==========================================
export const SEED_SELLERS: SellerInfo[] = [
  {
    id: "seller-retailnet",
    name: "RetailNet SuperStore",
    rating: 4.8,
    joinedYear: 2018,
    city: "Bengaluru",
    state: "Karnataka",
    badge: "Platinum Assured Seller",
  },
  {
    id: "seller-omnitech",
    name: "OmniTech India Retail",
    rating: 4.6,
    joinedYear: 2020,
    city: "Mumbai",
    state: "Maharashtra",
    badge: "Top Electronics Seller",
  },
  {
    id: "seller-truecom",
    name: "TrueCom Lifestyle & Fashion",
    rating: 4.5,
    joinedYear: 2021,
    city: "New Delhi",
    state: "Delhi",
    badge: "Authorized Brand Partner",
  },
  {
    id: "seller-livingspaces",
    name: "LivingSpaces Atelier",
    rating: 4.7,
    joinedYear: 2019,
    city: "Pune",
    state: "Maharashtra",
    badge: "Handcrafted Direct",
  },
];

// ==========================================
// SEED PRODUCTS
// ==========================================
export const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-apple-iphone-15-pro",
    title: "Apple iPhone 15 Pro (Natural Titanium, 128 GB)",
    brand: "Apple",
    category: "mobiles",
    subCategory: "all-mobiles",
    price: 124999,
    originalPrice: 134900,
    discountPercentage: 7,
    rating: 4.7,
    ratingCount: 14280,
    reviewCount: 1845,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 42,
    isAssured: true,
    featuredDeal: "Deal of the Day",
    description: "Experience aerospace-grade titanium design with Apple iPhone 15 Pro. Powered by the groundbreaking A17 Pro chip for pro-level gaming and camera performance. Features customizable Action button and versatile 48MP main camera system.",
    highlights: [
      "128 GB ROM",
      "15.49 cm (6.1 inch) Super Retina XDR OLED Display",
      "48MP + 12MP + 12MP | 12MP Front Camera",
      "A17 Pro Chip, 6 Core Processor",
      "Titanium frame with textured matte glass back",
      "Action button for instant shortcuts",
    ],
    specifications: [
      {
        category: "General",
        items: [
          { key: "Model Name", value: "iPhone 15 Pro" },
          { key: "Color", value: "Natural Titanium" },
          { key: "SIM Type", value: "Dual SIM (Nano + eSIM)" },
          { key: "Quick Charging", value: "Yes, up to 50% in 30 mins" },
        ],
      },
      {
        category: "Display Features",
        items: [
          { key: "Display Size", value: "15.49 cm (6.1 inch)" },
          { key: "Resolution", value: "2556 x 1179 Pixels" },
          { key: "Refresh Rate", value: "ProMotion 120Hz" },
          { key: "Peak Brightness", value: "2000 nits" },
        ],
      },
      {
        category: "Camera Features",
        items: [
          { key: "Primary Camera", value: "48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto" },
          { key: "Front Camera", value: "12MP TrueDepth" },
          { key: "Video Recording", value: "4K at 60 fps in ProRes log" },
        ],
      },
    ],
    variants: [
      { id: "v1", name: "Natural Titanium - 128 GB", sku: "IP15P-NT-128", price: 124999, originalPrice: 134900, stock: 42, color: "Natural Titanium", storage: "128 GB" },
      { id: "v2", name: "Natural Titanium - 256 GB", sku: "IP15P-NT-256", price: 134999, originalPrice: 144900, stock: 25, color: "Natural Titanium", storage: "256 GB" },
      { id: "v3", name: "Black Titanium - 128 GB", sku: "IP15P-BT-128", price: 124999, originalPrice: 134900, stock: 18, color: "Black Titanium", storage: "128 GB" },
    ],
    seller: SEED_SELLERS[0],
    bankOffers: [
      "Bank Offer: 5% Unlimited Cashback on BharatKart Axis Bank Credit Card",
      "Bank Offer: ₹5,000 Instant Discount on HDFC Bank Credit Card EMI",
      "Special Price: Get extra ₹9,901 off (price inclusive of cashback/coupon)",
      "Partner Offer: Sign-up for BharatKart Pay Later and get ₹500 Gift Card",
    ],
    warranty: "1 Year Manufacturer Warranty for Phone and 6 Months for In-Box Accessories",
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-samsung-galaxy-s24-ultra",
    title: "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB, 12 GB RAM)",
    brand: "Samsung",
    category: "mobiles",
    subCategory: "all-mobiles",
    price: 119999,
    originalPrice: 134999,
    discountPercentage: 11,
    rating: 4.6,
    ratingCount: 11520,
    reviewCount: 1320,
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 30,
    isAssured: true,
    featuredDeal: "Top Offers",
    description: "Welcome to the era of mobile AI with the Samsung Galaxy S24 Ultra. Built with durable titanium and Corning Gorilla Armor. Enjoy Circle to Search with Google, Live Translate, and stunning 200MP Quad Tele camera zoom.",
    highlights: [
      "12 GB RAM | 256 GB ROM",
      "17.27 cm (6.8 inch) Quad HD+ Dynamic AMOLED 2X Display",
      "200MP + 50MP + 12MP + 10MP | 12MP Front Camera",
      "5000 mAh Lithium-ion Battery with 45W Fast Charging",
      "Snapdragon 8 Gen 3 for Galaxy Processor",
      "Integrated S Pen Included",
    ],
    specifications: [
      {
        category: "General",
        items: [
          { key: "Model Name", value: "Galaxy S24 Ultra 5G" },
          { key: "Color", value: "Titanium Gray" },
          { key: "Network Type", value: "5G, 4G VOLTE, 3G" },
        ],
      },
      {
        category: "Display Features",
        items: [
          { key: "Display Size", value: "17.27 cm (6.8 inch)" },
          { key: "Resolution", value: "3120 x 1440 Pixels" },
          { key: "Peak Brightness", value: "2600 nits" },
        ],
      },
    ],
    seller: SEED_SELLERS[0],
    bankOffers: [
      "Bank Offer: ₹6,000 Instant Discount on ICICI Bank Cards",
      "No Cost EMI available starting ₹9,999/month",
    ],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-sony-wh1000xm5",
    title: "SONY WH-1000XM5 Wireless Active Noise Cancelling Bluetooth Headphones",
    brand: "Sony",
    category: "electronics",
    subCategory: "audio",
    price: 24990,
    originalPrice: 34990,
    discountPercentage: 28,
    rating: 4.8,
    ratingCount: 8430,
    reviewCount: 940,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 65,
    isAssured: true,
    featuredDeal: "Best of Electronics",
    description: "Industry-leading noise cancellation with two processors and 8 microphones. Magnificent sound quality engineered with the new 30mm driver unit. Up to 30 hours battery life with quick charging.",
    highlights: [
      "Industry Leading Noise Cancellation with 2 processors & 8 microphones",
      "Up to 30 Hours Battery Life",
      "3-minute charge for 3 hours of playback",
      "Crystal Clear Hands-Free Calling with 4 beamforming microphones",
      "Multipoint connection: Pair two Bluetooth devices simultaneously",
    ],
    specifications: [
      {
        category: "Sound Features",
        items: [
          { key: "Driver Unit", value: "30 mm Carbon Fiber" },
          { key: "Frequency Response", value: "4 Hz - 40,000 Hz" },
          { key: "Noise Cancellation", value: "Auto NC Optimizer" },
        ],
      },
    ],
    seller: SEED_SELLERS[1],
    bankOffers: [
      "Bank Offer: 10% Instant Discount on Axis Bank Credit Cards",
      "Special Price: Flat ₹10,000 off on MRP",
    ],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-macbook-air-m3",
    title: "Apple MacBook Air Apple M3 - (16 GB/512 GB SSD/macOS Sonoma) Midnight",
    brand: "Apple",
    category: "electronics",
    subCategory: "laptops",
    price: 124900,
    originalPrice: 134900,
    discountPercentage: 7,
    rating: 4.8,
    ratingCount: 3120,
    reviewCount: 420,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 15,
    isAssured: true,
    featuredDeal: "Best of Electronics",
    description: "Lean, mean M3 machine. Incredibly thin and blazing fast, MacBook Air sails through work and play with Apple's M3 chip. Delivers up to 18 hours of battery life in a striking Midnight anodized finish.",
    highlights: [
      "Apple M3 Chip (8-Core CPU, 10-Core GPU)",
      "16 GB Unified Memory | 512 GB SSD",
      "34.54 cm (13.6 inch) Liquid Retina Display with True Tone",
      "Up to 18 Hours Battery Life",
      "1080p FaceTime HD Camera & MagSafe 3 Charging",
    ],
    specifications: [
      {
        category: "Processor And Memory",
        items: [
          { key: "Processor", value: "Apple M3" },
          { key: "RAM", value: "16 GB Unified" },
          { key: "SSD Capacity", value: "512 GB" },
        ],
      },
    ],
    seller: SEED_SELLERS[0],
    bankOffers: [
      "Bank Offer: ₹5,000 Instant Discount on SBI Credit Card",
      "No Cost EMI available starting ₹10,408/month",
    ],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-lg-55-oled-evo",
    title: "LG OLED evo 139 cm (55 inch) Ultra HD (4K) Smart WebOS TV (OLED55C3PSA)",
    brand: "LG",
    category: "appliances",
    subCategory: "televisions",
    price: 114990,
    originalPrice: 179990,
    discountPercentage: 36,
    rating: 4.7,
    ratingCount: 4210,
    reviewCount: 680,
    thumbnail: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 18,
    isAssured: true,
    featuredDeal: "Top Offers",
    description: "Self-lit pixels that illuminate independently with infinite contrast. The α9 AI Processor Gen6 boosts picture and sound to cinematic heights. Features Dolby Vision IQ, Dolby Atmos, and NVIDIA G-Sync for ultimate 120Hz 4K gaming.",
    highlights: [
      "Ultra HD (4K) 3840 x 2160 Pixels",
      "120 Hz Refresh Rate with HDMI 2.1 & VRR",
      "α9 AI Processor Gen6 with Brightness Booster",
      "Dolby Vision IQ & Dolby Atmos Sound (40W)",
      "Magic Remote with AI Voice Control",
    ],
    specifications: [
      {
        category: "Display",
        items: [
          { key: "Screen Size", value: "139 cm (55 inch)" },
          { key: "Panel Type", value: "OLED evo" },
          { key: "HDR", value: "Cinema HDR, Dolby Vision, HDR10 Pro" },
        ],
      },
    ],
    seller: SEED_SELLERS[1],
    bankOffers: [
      "Bank Offer: ₹4,000 Instant Discount on HDFC Credit Card",
      "Free Installation & Demo within 48 hours",
    ],
    fastestDeliveryDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-dyson-v15-detect",
    title: "Dyson V15 Detect Extra Cordless Vacuum Cleaner with Laser Fluffy Cleaner Head",
    brand: "Dyson",
    category: "appliances",
    subCategory: "kitchen-appliances",
    price: 52900,
    originalPrice: 65900,
    discountPercentage: 19,
    rating: 4.8,
    ratingCount: 1980,
    reviewCount: 310,
    thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 22,
    isAssured: true,
    featuredDeal: "Deal of the Day",
    description: "Dyson's most powerful, intelligent cordless vacuum. Engineered with laser illumination that reveals invisible dust on hard floors. Piezo sensor continuously counts and measures dust particles to automatically increase suction power.",
    highlights: [
      "Laser reveals microscopic dust",
      "240 AW of powerful suction with Dyson Hyperdymium motor",
      "Up to 60 minutes run time with click-in battery",
      "LCD screen displays real-time particle count and battery countdown",
    ],
    specifications: [
      {
        category: "General",
        items: [
          { key: "Suction Power", value: "240 AW" },
          { key: "Weight", value: "3.1 kg" },
          { key: "Bin Volume", value: "0.76 L" },
        ],
      },
    ],
    seller: SEED_SELLERS[1],
    bankOffers: ["Bank Offer: ₹3,000 Instant Discount on Axis Bank Cards"],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-nike-air-jordan-1",
    title: "NIKE Air Jordan 1 Retro High OG Men's High-Top Sneakers (Chicago Lost & Found)",
    brand: "Nike",
    category: "fashion",
    subCategory: "footwear",
    price: 16995,
    originalPrice: 19995,
    discountPercentage: 15,
    rating: 4.9,
    ratingCount: 5620,
    reviewCount: 780,
    thumbnail: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 14,
    isAssured: true,
    featuredDeal: "Fashion deals",
    description: "The icon that started it all. The Air Jordan 1 Retro High OG reimagines the classic silhouette with aged leather aesthetics and vintage packaging storytelling.",
    highlights: [
      "Premium cracked leather upper for vintage aesthetic",
      "Encapsulated Nike Air-Sole unit in heel for cushioning",
      "Solid rubber cupsole with deep flex grooves",
      "Signature Wings logo on collar",
    ],
    specifications: [
      {
        category: "Product Details",
        items: [
          { key: "Color", value: "Varsity Red / Black / Sail" },
          { key: "Closure", value: "Lace-Up" },
          { key: "Sole Material", value: "Rubber" },
        ],
      },
    ],
    variants: [
      { id: "sz-8", name: "UK 8", sku: "AJ1-UK8", price: 16995, originalPrice: 19995, stock: 5, size: "UK 8" },
      { id: "sz-9", name: "UK 9", sku: "AJ1-UK9", price: 16995, originalPrice: 19995, stock: 6, size: "UK 9" },
      { id: "sz-10", name: "UK 10", sku: "AJ1-UK10", price: 16995, originalPrice: 19995, stock: 3, size: "UK 10" },
    ],
    seller: SEED_SELLERS[2],
    bankOffers: ["10% off on first fashion purchase with coupon WELCOME200"],
    fastestDeliveryDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-wakefit-ergonomic-chair",
    title: "Wakefit High Back Ergonomic Mesh Office Chair with Adjustable Lumbar Support",
    brand: "Wakefit",
    category: "home-furniture",
    subCategory: "office-furniture",
    price: 8999,
    originalPrice: 14999,
    discountPercentage: 40,
    rating: 4.5,
    ratingCount: 9810,
    reviewCount: 1240,
    thumbnail: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 45,
    isAssured: true,
    featuredDeal: "Home and furniture",
    description: "Designed for all-day comfort during long work and study hours. Features breathable Korean mesh, multi-directional 3D armrests, synchro-tilt mechanism with lock, and heavy-duty nylon wheelbase.",
    highlights: [
      "Breathable high-density mesh back prevents heat buildup",
      "Adjustable 2D Lumbar support for spine alignment",
      "Multi-lock tilt mechanism up to 135 degrees",
      "BIFMA certified Class-4 gas lift tested for up to 135 kg",
      "3 Years Comprehensive Manufacturer Warranty",
    ],
    specifications: [
      {
        category: "Dimensions",
        items: [
          { key: "Height", value: "115 - 125 cm" },
          { key: "Seat Width", value: "50 cm" },
          { key: "Max Weight Capacity", value: "135 kg" },
        ],
      },
    ],
    seller: SEED_SELLERS[3],
    bankOffers: ["Bank Offer: Flat ₹1,000 off on all credit cards"],
    fastestDeliveryDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-apple-watch-ultra-2",
    title: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case with Ocean Band",
    brand: "Apple",
    category: "mobiles",
    subCategory: "smart-wearables",
    price: 84900,
    originalPrice: 89900,
    discountPercentage: 5,
    rating: 4.9,
    ratingCount: 2890,
    reviewCount: 340,
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 16,
    isAssured: true,
    featuredDeal: "Best of Electronics",
    description: "The most rugged and capable Apple Watch. Powered by the S9 SiP with Double Tap gesture. Unbelievable 3000 nits display brightness for maximum visibility under direct desert sun.",
    highlights: [
      "49 mm aerospace-grade titanium case",
      "Dual-frequency GPS for precision pacing and route calculation",
      "Up to 36 hours regular battery life, 72 hours in Low Power Mode",
      "100m water resistance and certified EN13319 for recreational scuba diving",
    ],
    specifications: [
      {
        category: "Features",
        items: [
          { key: "Display", value: "Always-On Retina 3000 nits" },
          { key: "Sensors", value: "Depth gauge, Water temp, ECG, Blood Oxygen" },
        ],
      },
    ],
    seller: SEED_SELLERS[0],
    bankOffers: ["Bank Offer: ₹4,000 Instant Discount on HDFC Credit Cards"],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-philips-air-fryer-xxl",
    title: "PHILIPS Connected Airfryer XXL 1.4 kg, 7.2 L with Rapid Air Technology",
    brand: "Philips",
    category: "appliances",
    subCategory: "kitchen-appliances",
    price: 14999,
    originalPrice: 22995,
    discountPercentage: 35,
    rating: 4.6,
    ratingCount: 7120,
    reviewCount: 890,
    thumbnail: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 38,
    isAssured: true,
    featuredDeal: "Top Offers",
    description: "Healthy cooking made effortless. Cook with up to 90% less fat with Rapid Air Technology. Connect to the NutriU App to monitor your cooking from anywhere.",
    highlights: [
      "7.2 Liter Capacity (1.4 kg food capacity)",
      "2000 Watts powerful heating for fast cooking",
      "Digital touch screen with 16-in-1 cooking functions",
      "QuickClean basket with non-stick mesh",
    ],
    specifications: [
      {
        category: "General",
        items: [
          { key: "Capacity", value: "7.2 Liters" },
          { key: "Power", value: "2000 W" },
          { key: "Dishwasher Safe", value: "Yes" },
        ],
      },
    ],
    seller: SEED_SELLERS[1],
    bankOffers: ["Bank Offer: 5% Cashback on BharatKart Axis Bank Card"],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-forest-essentials-saffron-cream",
    title: "Forest Essentials Ayurvedic Kashmiri Saffron & Neem Tejasvi Night Emulsion (50g)",
    brand: "Forest Essentials",
    category: "beauty",
    subCategory: "skincare",
    price: 3250,
    originalPrice: 3850,
    discountPercentage: 15,
    rating: 4.8,
    ratingCount: 3410,
    reviewCount: 520,
    thumbnail: "https://images.unsplash.com/photo-1608248597359-5f21226b472e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597359-5f21226b472e?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 50,
    isAssured: true,
    featuredDeal: "Top Offers",
    description: "Infused with pure saffron grown in the valleys of Kashmir, sweet almond oil, and potent Ayurvedic botanicals to restore radiance and deep cellular hydration overnight.",
    highlights: [
      "100% Ayurvedic Formulation",
      "Infused with Pure Kashmiri Kumkuma (Saffron)",
      "Free from Parabens, Sulfates, and Petrochemicals",
      "Non-comedogenic and dermatologically tested",
    ],
    specifications: [
      {
        category: "Product Details",
        items: [
          { key: "Quantity", value: "50 g" },
          { key: "Skin Type", value: "All Skin Types" },
          { key: "Formulation", value: "Emulsion Cream" },
        ],
      },
    ],
    seller: SEED_SELLERS[2],
    bankOffers: ["Flat 15% off on luxury beauty essentials"],
    fastestDeliveryDays: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-marshall-stanmore-iii",
    title: "Marshall Stanmore III Bluetooth Wireless Home Speaker (Black)",
    brand: "Marshall",
    category: "electronics",
    subCategory: "audio",
    price: 38999,
    originalPrice: 44999,
    discountPercentage: 13,
    rating: 4.9,
    ratingCount: 2190,
    reviewCount: 310,
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 20,
    isAssured: true,
    featuredDeal: "Best of Electronics",
    description: "Heavyweight sound for your living room. Re-engineered with outward-angled tweeters and updated waveguides to deliver a consistently solid sound that is so wide it chases you around the room.",
    highlights: [
      "80 Watts RMS Total Power Output",
      "Bluetooth 5.2 with Next-Gen LE Audio Ready",
      "Classic Marshall vintage design with brass accents",
      "Analog volume, bass, and treble control knobs",
    ],
    specifications: [
      {
        category: "Audio Specs",
        items: [
          { key: "Amplifiers", value: "One 50 Watt Class D (Woofer), Two 15 Watt Class D (Tweeters)" },
          { key: "Inputs", value: "3.5 mm AUX, RCA, Bluetooth" },
        ],
      },
    ],
    seller: SEED_SELLERS[1],
    bankOffers: ["Bank Offer: ₹2,500 off on Axis Bank Cards"],
    fastestDeliveryDays: 1,
    createdAt: new Date().toISOString(),
  },
];

// ==========================================
// SEED PROMOTIONAL BANNERS
// ==========================================
export const SEED_BANNERS: PromotionalBanner[] = [
  {
    id: "banner-1",
    title: "THE BIG BILLION DAYS",
    subtitle: "India's Biggest Festival of Savings is Live! Up to 80% Off on Top Brands",
    ctaText: "Shop Electronics",
    ctaLink: "/search?category=electronics",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=85",
    badge: "FESTIVE BLOCKBUSTER",
    backgroundColor: "#1c2b59",
    textColor: "#ffffff",
    active: true,
  },
  {
    id: "banner-2",
    title: "NEXT-GEN SMARTPHONES",
    subtitle: "iPhone 15 Pro, Galaxy S24 Ultra & more. Up to ₹10,000 Exchange Bonus",
    ctaText: "Explore Mobiles",
    ctaLink: "/search?category=mobiles",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85",
    badge: "EXTRA CASHBACK",
    backgroundColor: "#0d1b2a",
    textColor: "#ffffff",
    active: true,
  },
  {
    id: "banner-3",
    title: "PREMIUM AUDIO & HOME LIVING",
    subtitle: "Sony, Marshall, Dyson, and LG. Upgrade Your Living Space Today",
    ctaText: "Grab Top Deals",
    ctaLink: "/search?category=appliances",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85",
    badge: "LIMITED STOCKS",
    backgroundColor: "#202020",
    textColor: "#ffffff",
    active: true,
  },
];

// ==========================================
// SEED HOMEPAGE SECTIONS
// ==========================================
export const SEED_SECTIONS: HomepageSection[] = [
  {
    id: "sec-electronics",
    title: "Best of Electronics",
    subtitle: "Headphones, Laptops, Watches & more",
    dealTag: "From ₹24,990",
    type: "carousel",
    productIds: [
      "prod-apple-iphone-15-pro",
      "prod-sony-wh1000xm5",
      "prod-macbook-air-m3",
      "prod-marshall-stanmore-iii",
      "prod-apple-watch-ultra-2",
    ],
    viewAllLink: "/search?category=electronics",
    timerEndTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    order: 1,
    active: true,
  },
  {
    id: "sec-top-offers",
    title: "Top Offers on Appliances & Living",
    subtitle: "Smart 4K TVs, Air Fryers & High-Performance Gadgets",
    dealTag: "Up to 40% Off",
    type: "carousel",
    productIds: [
      "prod-lg-55-oled-evo",
      "prod-dyson-v15-detect",
      "prod-philips-air-fryer-xxl",
      "prod-wakefit-ergonomic-chair",
    ],
    viewAllLink: "/search?category=appliances",
    order: 2,
    active: true,
  },
  {
    id: "sec-fashion-deals",
    title: "Fashion & Lifestyle Curations",
    subtitle: "Iconic Sneakers, Luxury Ayurvedic Care & Accessories",
    dealTag: "Trending Now",
    type: "carousel",
    productIds: [
      "prod-nike-air-jordan-1",
      "prod-forest-essentials-saffron-cream",
      "prod-apple-watch-ultra-2",
      "prod-sony-wh1000xm5",
    ],
    viewAllLink: "/search?category=fashion",
    order: 3,
    active: true,
  },
];

// ==========================================
// SEED COUPONS
// ==========================================
export const SEED_COUPONS: Coupon[] = [
  {
    code: "WELCOME200",
    discountType: "FIXED",
    discountValue: 200,
    minOrderValue: 999,
    description: "Flat ₹200 off on your first order above ₹999",
    expiresAt: "2027-12-31",
  },
  {
    code: "FESTIVE10",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderValue: 4999,
    maxDiscount: 2000,
    description: "10% Instant Discount up to ₹2,000 on festive orders",
    expiresAt: "2027-12-31",
  },
  {
    code: "FLIPDEAL",
    discountType: "FIXED",
    discountValue: 500,
    minOrderValue: 9999,
    description: "Special ₹500 discount on orders above ₹9,999",
    expiresAt: "2027-12-31",
  },
  {
    code: "AXISBANK5",
    discountType: "PERCENT",
    discountValue: 5,
    minOrderValue: 1000,
    maxDiscount: 1500,
    description: "5% Unlimited Cashback with Partner Bank Card",
    expiresAt: "2027-12-31",
  },
];

// ==========================================
// IN-MEMORY DATABASE STATE (SINGLETON)
// ==========================================
class MarketplaceDatabase {
  private products: Product[] = [...SEED_PRODUCTS];
  private categories: Category[] = [...SEED_CATEGORIES];
  private banners: PromotionalBanner[] = [...SEED_BANNERS];
  private sections: HomepageSection[] = [...SEED_SECTIONS];
  private coupons: Coupon[] = [...SEED_COUPONS];
  private sellers: SellerInfo[] = [...SEED_SELLERS];
  private orders: Order[] = [];

  constructor() {
    // Seed initial orders for tracking demo
    this.orders.push({
      id: "OD82910481928",
      userId: "user-1",
      customerName: "Rahul Sharma",
      customerEmail: "rahul.sharma@example.com",
      customerPhone: "+91 98765 43210",
      items: [
        {
          productId: "prod-sony-wh1000xm5",
          title: "SONY WH-1000XM5 Wireless Active Noise Cancelling Headphones",
          brand: "Sony",
          thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
          quantity: 1,
          price: 24990,
          sellerId: "seller-omnitech",
          sellerName: "OmniTech India Retail",
        },
      ],
      shippingAddress: {
        id: "addr-1",
        fullName: "Rahul Sharma",
        phone: "+91 98765 43210",
        pincode: "560001",
        locality: "Indiranagar, 100ft Road",
        addressLine: "Flat 402, Skyline Residency",
        city: "Bengaluru",
        state: "Karnataka",
        landmark: "Near Metro Station",
        type: "HOME",
        isDefault: true,
      },
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      subtotal: 24990,
      discount: 10000,
      couponCode: "WELCOME200",
      couponDiscount: 200,
      deliveryFee: 0,
      totalAmount: 24790,
      currentStatus: "Out For Delivery",
      trackingSteps: [
        { status: "Ordered", date: "24 Nov, 10:30 AM", completed: true, description: "Your order has been placed" },
        { status: "Order Confirmed", date: "24 Nov, 11:15 AM", completed: true, description: "Seller processed your item" },
        { status: "Shipped", date: "25 Nov, 08:00 AM", completed: true, description: "Item dispatched via BlueDart Express" },
        { status: "Out For Delivery", date: "Today, 09:30 AM", completed: true, description: "Courier executive out for delivery" },
        { status: "Delivered", date: "Expected by 07:00 PM", completed: false, description: "Package arriving today" },
      ],
      expectedDeliveryDate: "Today by 7:00 PM",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    });
  }

  // PRODUCTS
  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(productData: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLength;
  }

  // CATEGORIES
  getAllCategories(): Category[] {
    return this.categories;
  }

  // BANNERS
  getAllBanners(): PromotionalBanner[] {
    return this.banners.filter((b) => b.active);
  }

  getAllBannersAdmin(): PromotionalBanner[] {
    return this.banners;
  }

  addBanner(banner: Omit<PromotionalBanner, "id">): PromotionalBanner {
    const newBanner = { ...banner, id: `banner-${Date.now()}` };
    this.banners.push(newBanner);
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<PromotionalBanner>): PromotionalBanner | null {
    const index = this.banners.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.banners[index] = { ...this.banners[index], ...updates };
    return this.banners[index];
  }

  deleteBanner(id: string): boolean {
    const len = this.banners.length;
    this.banners = this.banners.filter((b) => b.id !== id);
    return this.banners.length < len;
  }

  // HOMEPAGE SECTIONS
  getAllSections(): HomepageSection[] {
    return this.sections.filter((s) => s.active).sort((a, b) => a.order - b.order);
  }

  getAllSectionsAdmin(): HomepageSection[] {
    return this.sections.sort((a, b) => a.order - b.order);
  }

  addSection(section: Omit<HomepageSection, "id">): HomepageSection {
    const newSection = { ...section, id: `sec-${Date.now()}` };
    this.sections.push(newSection);
    return newSection;
  }

  updateSection(id: string, updates: Partial<HomepageSection>): HomepageSection | null {
    const index = this.sections.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.sections[index] = { ...this.sections[index], ...updates };
    return this.sections[index];
  }

  deleteSection(id: string): boolean {
    const len = this.sections.length;
    this.sections = this.sections.filter((s) => s.id !== id);
    return this.sections.length < len;
  }

  // ORDERS
  getAllOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(orderData: Omit<Order, "id" | "createdAt" | "currentStatus" | "trackingSteps">): Order {
    const orderId = `OD${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      currentStatus: "Order Confirmed",
      trackingSteps: [
        { status: "Ordered", date: "Just now", completed: true, description: "Order has been placed successfully." },
        { status: "Order Confirmed", date: "Just now", completed: true, description: "Seller received your order." },
        { status: "Shipped", date: "Expected in 24 hours", completed: false, description: "Package will be dispatched soon." },
        { status: "Out For Delivery", date: "Pending dispatch", completed: false, description: "Courier on the way." },
        { status: "Delivered", date: orderData.expectedDeliveryDate, completed: false, description: "Will be delivered safely." },
      ],
      createdAt: new Date().toISOString(),
    };

    // Deduct stock
    orderData.items.forEach((item) => {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
        if (prod.stockCount === 0) {
          prod.inStock = false;
        }
      }
    });

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order["currentStatus"]): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.currentStatus = status;

    // Update tracking steps up to this status
    const statusOrder: Order["currentStatus"][] = [
      "Ordered",
      "Order Confirmed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
    ];
    const targetIdx = statusOrder.indexOf(status);

    if (targetIdx !== -1) {
      order.trackingSteps = order.trackingSteps.map((step) => {
        const stepIdx = statusOrder.indexOf(step.status);
        if (stepIdx <= targetIdx && stepIdx !== -1) {
          return { ...step, completed: true, date: step.completed ? step.date : "Updated just now" };
        }
        return step;
      });
    }

    return order;
  }

  // COUPONS
  getCoupon(code: string): Coupon | undefined {
    return this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  }

  // SELLERS
  getAllSellers(): SellerInfo[] {
    return this.sellers;
  }
}

// Global singleton instance
declare global {
  var __dbInstance: MarketplaceDatabase | undefined;
}

export const db = global.__dbInstance || new MarketplaceDatabase();
if (process.env.NODE_ENV !== "production") {
  global.__dbInstance = db;
}
