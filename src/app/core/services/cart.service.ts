import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, Cart, CouponCode } from '../models/cart.model';
import { StorageService } from './storage.service';

const DEMO_CART_ITEMS: CartItem[] = [
  {
    productId: 'prd-001',
    productName: 'iPhone 15 Pro Max 256GB — Titan Tự Nhiên',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
    shopId: 'shop-apple',
    shopName: 'Apple Store Việt Nam',
    price: 28_990_000,
    originalPrice: 32_990_000,
    quantity: 1,
    stock: 10,
  },
  {
    productId: 'prd-002',
    productName: 'Tai nghe Sony WH-1000XM5 Chống ồn',
    productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop',
    shopId: 'shop-tech',
    shopName: 'TechZone Official',
    price: 6_490_000,
    originalPrice: 7_990_000,
    quantity: 2,
    stock: 25,
  },
  {
    productId: 'prd-003',
    productName: 'Áo thun Uniqlo U Crew Neck SS',
    productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    shopId: 'shop-fashion',
    shopName: 'Fashion Hub',
    price: 299_000,
    originalPrice: 399_000,
    quantity: 3,
    stock: 50,
  },
];

const MOCK_COUPONS: CouponCode[] = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 200000, maxDiscount: 100000, expiresAt: new Date('2025-12-31'), isActive: true },
  { code: 'SALE50K', discountType: 'fixed', discountValue: 50000, minOrderAmount: 500000, maxDiscount: 50000, expiresAt: new Date('2025-06-30'), isActive: true },
  { code: 'MEGA20', discountType: 'percentage', discountValue: 20, minOrderAmount: 1000000, maxDiscount: 500000, expiresAt: new Date('2025-12-31'), isActive: true },
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  private readonly _items = signal<CartItem[]>([]);
  private readonly _appliedCoupon = signal<CouponCode | null>(null);

  readonly items = this._items.asReadonly();
  readonly appliedCoupon = this._appliedCoupon.asReadonly();

  readonly totalItems = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  readonly discountAmount = computed(() => {
    const coupon = this._appliedCoupon();
    if (!coupon) return 0;
    const sub = this.subtotal();
    if (sub < coupon.minOrderAmount) return 0;
    if (coupon.discountType === 'percentage') {
      return Math.min(sub * coupon.discountValue / 100, coupon.maxDiscount);
    }
    return coupon.discountValue;
  });
  readonly totalAmount = computed(() => Math.max(0, this.subtotal() - this.discountAmount()));

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = this.storage.getItem<CartItem[]>('cart');
    if (saved) {
      this._items.set(saved);
    }
  }

  private saveToStorage(): void {
    this.storage.setItem('cart', this._items());
  }

  addToCart(item: CartItem): void {
    this._items.update(items => {
      const existing = items.find(i => i.productId === item.productId);
      if (existing) {
        return items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        );
      }
      return [...items, item];
    });
    this.saveToStorage();
  }

  removeFromCart(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      )
    );
    this.saveToStorage();
  }

  clearCart(): void {
    this._items.set([]);
    this._appliedCoupon.set(null);
    this.saveToStorage();
  }

  applyCoupon(code: string): { success: boolean; message: string } {
    const coupon = MOCK_COUPONS.find(c => c.code === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
    }
    if (new Date() > coupon.expiresAt) {
      return { success: false, message: 'Mã giảm giá đã hết hạn sử dụng' };
    }
    if (this.subtotal() < coupon.minOrderAmount) {
      return { success: false, message: `Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}₫ để áp dụng mã này` };
    }
    this._appliedCoupon.set(coupon);
    return { success: true, message: 'Áp dụng mã giảm giá thành công!' };
  }

  removeCoupon(): void {
    this._appliedCoupon.set(null);
  }

  getCart(): Cart {
    return {
      items: this._items(),
      totalItems: this.totalItems(),
      totalAmount: this.totalAmount()
    };
  }

  /** Nạp dữ liệu demo khi giỏ hàng trống (lần đầu truy cập) */
  seedDemoIfEmpty(): void {
    if (this._items().length === 0 && !this.storage.getItem('cart_seeded')) {
      this._items.set(DEMO_CART_ITEMS);
      this.storage.setItem('cart', DEMO_CART_ITEMS);
      this.storage.setItem('cart_seeded', true);
    }
  }
}
