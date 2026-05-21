export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'e_wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber: string;
  shippingCarrier: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderCode: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  customerName: string;
  shopName: string;
  createdAt: Date;
}
