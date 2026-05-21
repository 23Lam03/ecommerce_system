import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-shop-inventory-management',
  standalone: true,
  imports: [CurrencyVndPipe],
  templateUrl: './inventory-management.html',
  styleUrl: './inventory-management.css',
})
export class InventoryManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly savingId = signal<string | null>(null);
  protected readonly stockEdits = signal<Record<string, number>>({});
  protected readonly filterStock = signal<'all' | 'low' | 'out'>('all');
  protected readonly searchQuery = signal('');

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly products = computed(() => {
    let list = this.productService.getProductsByShop(this.shopId());
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.filterStock();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
    if (filter === 'low') list = list.filter(p => p.stock > 0 && p.stock <= 10);
    if (filter === 'out') list = list.filter(p => p.stock === 0);
    return list.sort((a, b) => a.stock - b.stock);
  });

  protected readonly totalStockValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.price * p.stock, 0)
  );

  protected readonly lowStockCount = computed(() =>
    this.productService.getProductsByShop(this.shopId()).filter(p => p.stock > 0 && p.stock <= 10).length
  );

  protected readonly outOfStockCount = computed(() =>
    this.productService.getProductsByShop(this.shopId()).filter(p => p.stock === 0).length
  );

  protected getStock(productId: string, defaultStock: number): number {
    return this.stockEdits()[productId] ?? defaultStock;
  }

  protected onStockInput(productId: string, event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 0) {
      this.stockEdits.update(e => ({ ...e, [productId]: val }));
    }
  }

  protected saveStock(productId: string, originalStock: number): void {
    const qty = this.stockEdits()[productId];
    if (qty == null || qty === originalStock) {
      this.stockEdits.update(e => {
        const { [productId]: _, ...rest } = e;
        return rest;
      });
      return;
    }
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

  protected stockClass(stock: number): string {
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock <= 5) return 'bg-amber-100 text-amber-700';
    if (stock <= 10) return 'bg-orange-100 text-orange-700';
    return 'bg-emerald-100 text-emerald-700';
  }
}
