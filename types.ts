
export type Category = 'All' | 'Nasi Kotak' | 'Tumpeng' | 'Prasmanan' | 'Aqiqah' | 'Snack Box' | 'Kue' | 'Syukuran' | 'Wedding' | 'Minuman' | 'Lainnya';

export interface MenuItem {
  id: number;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
  minOrder?: number;
  pricingType?: 'pax' | 'fixed';
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML Content
  date: string;
  image: string;
  slug: string;
  author?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// --- New Types for Custom Menu & Auth ---

export type CustomMenuCategory = 'Karbo' | 'Ayam' | 'Daging' | 'Seafood' | 'Sayur' | 'Pendamping' | 'Dessert' | 'Minuman';

export interface CustomMenuItem {
  id: string;
  name: string;
  category: CustomMenuCategory;
  price: number;
  image: string;
  minQty?: number;
  maxQty?: number;
}

export interface Address {
  id: string;
  label: string; // e.g., "Rumah", "Kantor"
  recipient: string;
  phone: string;
  fullAddress: string;
  city: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderTimeline {
  Pending?: string;
  Diproses?: string;
  Diantar?: string;
  Selesai?: string;
  [key: string]: string | undefined; // Index signature for safe access
}

export interface Order {
  id: string;
  date: string; // ISO String preferred
  items: string; // Simplified description of items
  total: number;
  status: 'Pending' | 'Diproses' | 'Diantar' | 'Selesai';
  pax: number;
  timeline?: OrderTimeline;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // e.g. "Istri", "Anak", "Karyawan"
  birthDate: string;
}

export interface SavedMenu {
  id: string;
  name: string; // e.g. "Paket Ultah Anak"
  totalPrice: number;
  itemsSummary: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, never store plain text
  phone?: string;
  addresses: Address[];
  orders: Order[];
  joinedDate: string;

  // New Loyalty & Feature Fields
  membershipTier: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number; // 1 point per 100k
  companyName?: string;
  companyLogo?: string;
  familyMembers: FamilyMember[];
  savedMenus: SavedMenu[];
}
