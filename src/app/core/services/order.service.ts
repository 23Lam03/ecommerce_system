import { Injectable, signal, inject } from '@angular/core';
import { Order, OrderStatus, PaymentTransaction } from '../models/order.model';
import { StorageService } from './storage.service';
import { CartService } from './cart.service';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD001', orderCode: 'DH20240001', customerId: 'USR001', customerName: 'Nguyễn Văn An', customerPhone: '0901234567',
    shopId: 'SHOP001', shopName: 'TechZone Store',
    items: [
      { productId: 'PRD001', productName: 'iPhone 15 Pro Max 256GB', productImage: 'https://picsum.photos/seed/iphone15/600/600', price: 28990000, quantity: 1, subtotal: 28990000 },
      { productId: 'PRD007', productName: 'Tai nghe AirPods Pro 2', productImage: 'https://picsum.photos/seed/airpods/600/600', price: 5490000, quantity: 1, subtotal: 5490000 }
    ],
    totalAmount: 34480000, discountAmount: 500000, shippingFee: 0, finalAmount: 33980000,
    shippingAddress: '123 Lê Lợi, Q.1, TP.HCM', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
    status: 'delivered', trackingNumber: 'VN123456789', shippingCarrier: 'Giao Hàng Nhanh',
    note: 'Giao giờ hành chính', createdAt: new Date('2024-10-15'), updatedAt: new Date('2024-10-20')
  },
  {
    id: 'ORD002', orderCode: 'DH20240002', customerId: 'USR001', customerName: 'Nguyễn Văn An', customerPhone: '0901234567',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN',
    items: [
      { productId: 'PRD004', productName: 'Áo Polo Nam Premium Cotton', productImage: 'https://picsum.photos/seed/polo/600/600', price: 299000, quantity: 3, subtotal: 897000 },
      { productId: 'PRD012', productName: 'Quần Jean Nam Slim Fit', productImage: 'https://picsum.photos/seed/jeans/600/600', price: 459000, quantity: 2, subtotal: 918000 }
    ],
    totalAmount: 1815000, discountAmount: 0, shippingFee: 30000, finalAmount: 1845000,
    shippingAddress: '123 Lê Lợi, Q.1, TP.HCM', paymentMethod: 'cod', paymentStatus: 'pending',
    status: 'shipping', trackingNumber: 'VN987654321', shippingCarrier: 'J&T Express',
    note: '', createdAt: new Date('2024-11-01'), updatedAt: new Date('2024-11-03')
  },
  {
    id: 'ORD003', orderCode: 'DH20240003', customerId: 'USR004', customerName: 'Phạm Hồng Đào', customerPhone: '0934567890',
    shopId: 'SHOP001', shopName: 'TechZone Store',
    items: [
      { productId: 'PRD003', productName: 'MacBook Pro 14" M3 Pro', productImage: 'https://picsum.photos/seed/macbook14/600/600', price: 42990000, quantity: 1, subtotal: 42990000 }
    ],
    totalAmount: 42990000, discountAmount: 1000000, shippingFee: 0, finalAmount: 41990000,
    shippingAddress: '321 Hai Bà Trưng, Q.3, TP.HCM', paymentMethod: 'e_wallet', paymentStatus: 'paid',
    status: 'confirmed', trackingNumber: '', shippingCarrier: '',
    note: 'Cần hóa đơn VAT', createdAt: new Date('2024-11-10'), updatedAt: new Date('2024-11-10')
  },
  {
    id: 'ORD004', orderCode: 'DH20240004', customerId: 'USR005', customerName: 'Võ Thanh Sơn', customerPhone: '0945678901',
    shopId: 'SHOP003', shopName: 'HomeLife Decor',
    items: [
      { productId: 'PRD006', productName: 'Nồi chiên không dầu 6L', productImage: 'https://picsum.photos/seed/airfryer/600/600', price: 1290000, quantity: 1, subtotal: 1290000 },
      { productId: 'PRD016', productName: 'Bộ nồi inox 5 đáy 4 món', productImage: 'https://picsum.photos/seed/pots/600/600', price: 1450000, quantity: 1, subtotal: 1450000 }
    ],
    totalAmount: 2740000, discountAmount: 0, shippingFee: 50000, finalAmount: 2790000,
    shippingAddress: '654 Cách Mạng Tháng 8, Q.10, TP.HCM', paymentMethod: 'cod', paymentStatus: 'pending',
    status: 'pending', trackingNumber: '', shippingCarrier: '',
    note: 'Gọi trước khi giao', createdAt: new Date('2024-11-15'), updatedAt: new Date('2024-11-15')
  },
  {
    id: 'ORD005', orderCode: 'DH20240005', customerId: 'USR004', customerName: 'Phạm Hồng Đào', customerPhone: '0934567890',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN',
    items: [
      { productId: 'PRD005', productName: 'Váy Đầm Nữ Hoa Nhí Vintage', productImage: 'https://picsum.photos/seed/dress/600/600', price: 389000, quantity: 2, subtotal: 778000 },
      { productId: 'PRD014', productName: 'Túi xách nữ da PU cao cấp', productImage: 'https://picsum.photos/seed/handbag/600/600', price: 520000, quantity: 1, subtotal: 520000 },
      { productId: 'PRD017', productName: 'Son môi MAC Ruby Woo', productImage: 'https://picsum.photos/seed/lipstick/600/600', price: 490000, quantity: 1, subtotal: 490000 }
    ],
    totalAmount: 1788000, discountAmount: 178800, shippingFee: 25000, finalAmount: 1634200,
    shippingAddress: '321 Hai Bà Trưng, Q.3, TP.HCM', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
    status: 'delivered', trackingNumber: 'VN555666777', shippingCarrier: 'Viettel Post',
    note: '', createdAt: new Date('2024-10-28'), updatedAt: new Date('2024-11-02')
  }
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storage = inject(StorageService);
  private readonly cartService = inject(CartService);
  private readonly _orders = signal<Order[]>([...MOCK_ORDERS]);

  readonly orders = this._orders.asReadonly();

  getOrders(): Order[] {
    return this._orders();
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this._orders().filter(o => o.customerId === customerId);
  }

  getOrdersByShop(shopId: string): Order[] {
    return this._orders().filter(o => o.shopId === shopId);
  }

  getOrderById(id: string): Order | undefined {
    return this._orders().find(o => o.id === id);
  }

  getOrderByCode(code: string): Order | undefined {
    return this._orders().find(o => o.orderCode === code);
  }

  createOrder(order: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: 'ORD' + String(this._orders().length + 1).padStart(3, '0'),
      orderCode: 'DH' + new Date().getFullYear() + String(this._orders().length + 1).padStart(4, '0'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._orders.update(orders => [newOrder, ...orders]);
    this.cartService.clearCart();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this._orders.update(orders =>
      orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o)
    );
  }

  updateTrackingInfo(orderId: string, trackingNumber: string, shippingCarrier: string): void {
    this._orders.update(orders =>
      orders.map(o => o.id === orderId ? { ...o, trackingNumber, shippingCarrier, updatedAt: new Date() } : o)
    );
  }

  cancelOrder(orderId: string): void {
    this.updateOrderStatus(orderId, 'cancelled');
  }

  getPaymentTransactions(): PaymentTransaction[] {
    return this._orders().map(o => ({
      id: 'PAY-' + o.id,
      orderId: o.id,
      orderCode: o.orderCode,
      amount: o.finalAmount,
      method: o.paymentMethod,
      status: o.paymentStatus,
      customerName: o.customerName,
      shopName: o.shopName,
      createdAt: o.createdAt
    }));
  }

  getTransactionsByShop(shopId: string): PaymentTransaction[] {
    return this.getPaymentTransactions().filter(t => {
      const order = this.getOrderById(t.orderId.replace('PAY-', ''));
      return order?.shopId === shopId;
    });
  }

  getTotalRevenue(): number {
    return this._orders()
      .filter(o => o.status === 'delivered' && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0);
  }

  getShopRevenue(shopId: string): number {
    return this.getOrdersByShop(shopId)
      .filter(o => o.status === 'delivered' && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0);
  }
}
