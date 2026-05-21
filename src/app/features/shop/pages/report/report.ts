import { Component, inject, computed, signal } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-report',
  standalone: true,
  imports: [CurrencyVndPipe, FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class ReportComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly orders = computed(() => this.orderService.getOrdersByShop(this.shopId()));

  protected readonly totalRevenue = computed(() =>
    this.orders()
      .filter(o => o.status === 'delivered' && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0)
  );

  protected readonly totalOrders = computed(() => this.orders().length);

  protected readonly completedOrders = computed(() =>
    this.orders().filter(o => o.status === 'delivered').length
  );

  protected readonly pendingOrders = computed(() =>
    this.orders().filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length
  );

  protected readonly shippingOrders = computed(() =>
    this.orders().filter(o => o.status === 'shipping').length
  );

  protected readonly monthlyData = [
    { month: 'T6/2025', orders: 45, revenue: 125000000 },
    { month: 'T7/2025', orders: 62, revenue: 178000000 },
    { month: 'T8/2025', orders: 58, revenue: 162000000 },
    { month: 'T9/2025', orders: 71, revenue: 198000000 },
    { month: 'T10/2025', orders: 85, revenue: 245000000 },
    { month: 'T11/2025', orders: 93, revenue: 267000000 },
  ];

  protected readonly maxRevenue = computed(() => Math.max(...this.monthlyData.map(d => d.revenue)));

  protected chartHeight = 160;

  protected barHeight(revenue: number): number {
    return Math.round((revenue / this.maxRevenue()) * this.chartHeight);
  }
}
