import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { Product, ProductStatus } from '../../../../core/models/product.model';

@Component({
  selector: 'app-shop-product-management',
  standalone: true,
  imports: [RouterLink, CurrencyVndPipe, ConfirmDialog],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly statusFilter = signal<ProductStatus | 'all'>('all');
  protected readonly searchQuery = signal('');
  protected readonly deleteTarget = signal<Product | null>(null);
  protected readonly showDelete = signal(false);
  protected readonly editProduct = signal<Product | null>(null);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly products = computed(() => {
    let list = this.productService.getProductsByShop(this.shopId());
    const s = this.statusFilter();
    const q = this.searchQuery().toLowerCase().trim();
    if (s !== 'all') list = list.filter(p => p.status === s);
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    );
    return list;
  });

  protected statusLabel(s: ProductStatus): string {
    return { active: 'Đang bán', inactive: 'Ẩn', pending: 'Chờ duyệt', rejected: 'Từ chối' }[s];
  }

  protected statusClass(s: ProductStatus): string {
    return {
      active: 'bg-emerald-100 text-emerald-800',
      inactive: 'bg-slate-200 text-slate-600',
      pending: 'bg-amber-100 text-amber-800',
      rejected: 'bg-red-100 text-red-800',
    }[s];
  }

  protected confirmDelete(p: Product): void {
    this.deleteTarget.set(p);
    this.showDelete.set(true);
  }

  protected onDeleteConfirmed(): void {
    const p = this.deleteTarget();
    if (p) {
      this.productService.deleteProduct(p.id);
      this.notification.success('Đã xóa sản phẩm');
    }
    this.showDelete.set(false);
    this.deleteTarget.set(null);
  }

  protected toggleActive(p: Product): void {
    const next: ProductStatus = p.status === 'active' ? 'inactive' : 'active';
    this.productService.updateProductStatus(p.id, next);
    this.notification.success(next === 'active' ? 'Đã hiển thị sản phẩm' : 'Đã ẩn sản phẩm');
  }
}
