export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiresAt: Date;
  isActive: boolean;
}
