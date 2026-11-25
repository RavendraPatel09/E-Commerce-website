export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Black - 256GB"
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  color?: string;
  storage?: string;
  size?: string;
  image?: string;
}

export interface ProductSpecification {
  category: string; // e.g. "General", "Display Features", "Camera", "Battery"
  items: { key: string; value: string }[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  location?: string;
  images?: string[];
}

export interface SellerInfo {
  id: string;
  name: string;
  rating: number;
  joinedYear: number;
  city: string;
  state: string;
  badge?: string; // "Top Seller", "Assured Partner"
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number; // Discounted selling price in INR
  originalPrice: number; // MRP in INR
  discountPercentage: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stockCount: number;
  isAssured: boolean; // e.g. "Flipkart / BharatKart Assured"
  featuredDeal?: string; // "Deal of the Day", "Hot Deal", "Best Seller"
  description: string;
  highlights: string[];
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  seller: SellerInfo;
  bankOffers?: string[];
  warranty?: string;
  fastestDeliveryDays: number; // e.g. 1 or 2 days
  reviews?: Review[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // URL or Lucide icon name
  description?: string;
  subcategories: {
    name: string;
    slug: string;
    popularItems?: string[];
  }[];
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  badge?: string;
  backgroundColor?: string;
  textColor?: string;
  active: boolean;
}

export interface HomepageSection {
  id: string;
  title: string;
  subtitle?: string;
  dealTag?: string;
  type: "carousel" | "grid" | "banner-deal";
  productIds: string[];
  viewAllLink: string;
  timerEndTime?: string; // ISO string for countdown e.g. Deal of the day timer
  backgroundColor?: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  selectedPrice: number;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  locality: string;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  type: "HOME" | "WORK";
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  brand: string;
  thumbnail: string;
  variantName?: string;
  quantity: number;
  price: number;
  sellerId: string;
  sellerName: string;
}

export interface OrderTrackingStep {
  status: "Ordered" | "Order Confirmed" | "Shipped" | "Out For Delivery" | "Delivered" | "Cancelled";
  date: string;
  completed: boolean;
  description: string;
}

export interface Order {
  id: string; // e.g. "OD82910481928"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "UPI" | "CARD" | "NET_BANKING" | "COD" | "EMI" | "RAZORPAY";
  paymentStatus: "PAID" | "PENDING" | "COD_PENDING" | "REFUNDED";
  paymentId?: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount?: number;
  deliveryFee: number;
  totalAmount: number;
  currentStatus: "Ordered" | "Order Confirmed" | "Shipped" | "Out For Delivery" | "Delivered" | "Cancelled";
  trackingSteps: OrderTrackingStep[];
  expectedDeliveryDate: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller" | "admin";
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
}
