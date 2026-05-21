import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { Product, ProductStatus } from '../../../../core/models/product.model';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CurrencyVndPipe],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<ProductStatus | 'all' | 'pending'>('all');
  protected readonly viewProduct = signal<Product | null>(null);
  protected readonly moderatingId = signal<string | null>(null);

  protected readonly products = computed(() => {
    let list = this.productService.getAllProducts();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.shopName.toLowerCase().includes(q));
    if (status !== 'all') list = list.filter(p => p.status === status);
    return list;
  });

  protected statusLabel(s: ProductStatus): string {
    return { active: 'Đang bán', inactive: 'Ẩn', pending: 'Chờ duyệt', rejected: 'Từ chối' }[s];
  }

  protected statusClass(s: ProductStatus): string {
    return {
      active: 'bg-emerald-100 text-emerald-800', inactive: 'bg-slate-200 text-slate-600',
      pending: 'bg-amber-100 text-amber-800', rejected: 'bg-red-100 text-red-800',
    }[s];
  }

  protected moderate(productId: string, status: ProductStatus): void {
    this.moderatingId.set(productId);
    setTimeout(() => {
      this.productService.updateProductStatus(productId, status);
      this.moderatingId.set(null);
      this.notification.success(status === 'active' ? 'Đã phê duyệt sản phẩm' : 'Đã cập nhật trạng thái');
    }, 300);
  }
}
