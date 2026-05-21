import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { CartItem } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyVndPipe],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css',
})
export class ShoppingCartComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);

  protected readonly isApplyingCoupon = signal(false);
  protected readonly isCheckingOut = signal(false);
  protected readonly removingProductId = signal<string | null>(null);
  protected readonly couponMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  protected readonly items = this.cartService.items;
  protected readonly isEmpty = computed(() => this.cartService.items().length === 0);
  protected readonly shippingFee = computed(() =>
    this.cartService.subtotal() >= 500000 ? 0 : 30000
  );
  protected readonly grandTotal = computed(
    () => this.cartService.totalAmount() + this.shippingFee()
  );

  protected readonly couponForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    this.cartService.seedDemoIfEmpty();
  }

  protected getCouponError(): string | null {
    const control = this.couponForm.controls.code;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'Vui lòng nhập mã giảm giá';
    if (control.hasError('minlength')) return 'Mã giảm giá tối thiểu 3 ký tự';
    if (control.hasError('maxlength')) return 'Mã giảm giá tối đa 20 ký tự';
    return null;
  }

  protected decrement(item: CartItem): void {
    if (item.quantity <= 1) return;
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  protected increment(item: CartItem): void {
    if (item.quantity >= item.stock) {
      this.notification.warning(`Chỉ còn ${item.stock} sản phẩm trong kho`);
      return;
    }
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  protected onQuantityInput(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) {
      input.value = String(item.quantity);
      return;
    }
    this.cartService.updateQuantity(item.productId, value);
  }

  protected removeItem(productId: string): void {
    this.removingProductId.set(productId);
    setTimeout(() => {
      this.cartService.removeFromCart(productId);
      this.removingProductId.set(null);
      this.notification.info('Đã xóa sản phẩm khỏi giỏ hàng');
    }, 200);
  }

  protected applyCoupon(): void {
    this.couponForm.markAllAsTouched();
    if (this.couponForm.invalid) return;

    this.isApplyingCoupon.set(true);
    this.couponMessage.set(null);

    const code = this.couponForm.getRawValue().code.trim();
    setTimeout(() => {
      const result = this.cartService.applyCoupon(code);
      this.couponMessage.set({
        type: result.success ? 'success' : 'error',
        text: result.message,
      });
      if (result.success) {
        this.notification.success(result.message);
        this.couponForm.reset();
      }
      this.isApplyingCoupon.set(false);
    }, 400);
  }

  protected removeCoupon(): void {
    this.cartService.removeCoupon();
    this.couponMessage.set(null);
    this.notification.info('Đã gỡ mã giảm giá');
  }

  protected clearCart(): void {
    this.cartService.clearCart();
    this.couponMessage.set(null);
    this.notification.info('Đã xóa toàn bộ giỏ hàng');
  }

  protected proceedToCheckout(): void {
    if (this.isEmpty()) {
      this.notification.warning('Giỏ hàng trống, vui lòng thêm sản phẩm');
      return;
    }
    this.isCheckingOut.set(true);
    setTimeout(() => {
      this.isCheckingOut.set(false);
      this.notification.success('Chuyển đến trang thanh toán (sẽ triển khai ở bước tiếp theo)');
      this.router.navigate(['/orders']);
    }, 800);
  }

  protected itemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  protected hasDiscount(item: CartItem): boolean {
    return item.originalPrice > item.price;
  }
}
