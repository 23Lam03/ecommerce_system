import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-shop-inventory-management',
  standalone: true,
  imports: [],
  templateUrl: './inventory-management.html',
  styleUrl: './inventory-management.css',
})
export class InventoryManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly savingId = signal<string | null>(null);
  protected readonly stockEdits = signal<Record<string, number>>({});

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly products = computed(() => this.productService.getProductsByShop(this.shopId()));

  protected getStock(productId: string, defaultStock: number): number {
    return this.stockEdits()[productId] ?? defaultStock;
  }

  protected onStockInput(productId: string, event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 0) {
      this.stockEdits.update(e => ({ ...e, [productId]: val }));
    }
  }

  protected saveStock(productId: string): void {
    const qty = this.stockEdits()[productId];
    if (qty == null) return;
    this.savingId.set(productId);
    setTimeout(() => {
      this.productService.updateStock(productId, qty);
      this.stockEdits.update(e => {
        const { [productId]: _, ...rest } = e;
        return rest;
      });
      this.savingId.set(null);
      this.notification.success('Đã cập nhật tồn kho');
    }, 300);
  }
}
