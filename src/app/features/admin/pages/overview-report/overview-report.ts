import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { OrderService } from '../../../../core/services/order.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-admin-overview-report',
  standalone: true,
  imports: [CurrencyVndPipe],
  templateUrl: './overview-report.html',
  styleUrl: './overview-report.css',
})
export class OverviewReportComponent {
  protected readonly Math = Math;
  protected readonly auth = inject(AuthService);
  protected readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);

  protected readonly stats = computed(() => ({
    shops: this.auth.allShops().length,
    products: this.productService.getAllProducts().length,
    orders: this.orderService.getOrders().length,
    revenue: this.orderService.getTotalRevenue(),
  }));

  protected readonly pendingShops = computed(() =>
    this.auth.allShops().filter(s => s.status === 'pending').length
  );

  protected readonly pendingProducts = computed(() =>
    this.productService.getAllProducts().filter(p => p.status === 'pending').length
  );

  protected readonly chartData = computed(() => {
    const months = ['T6', 'T7', 'T8', 'T9', 'T10', 'T11'];
    const values = [120, 180, 150, 220, 280, 340];
    const max = Math.max(...values);
    return months.map((label, i) => ({ label, value: values[i], pct: (values[i] / max) * 100 }));
  });

  protected readonly maxRevenue = 340;
}
