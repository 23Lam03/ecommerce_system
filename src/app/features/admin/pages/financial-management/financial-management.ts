import { Component, inject, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-financial-management',
  standalone: true,
  imports: [CurrencyVndPipe, DatePipe, DecimalPipe],
  templateUrl: './financial-management.html',
  styleUrl: './financial-management.css',
})
export class FinancialManagementComponent {
  protected readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);

  protected readonly totalRevenue = computed(() => this.orderService.getTotalRevenue());
  protected readonly platformRevenue = computed(() => Math.round(this.totalRevenue() * 0.02));
  protected readonly transactions = computed(() => this.orderService.getPaymentTransactions());
  protected readonly completedOrders = computed(() =>
    this.transactions().filter(t => t.status === 'paid')
  );

  protected readonly monthlyData = [
    { month: 'T6', revenue: 120000000, platformFee: 2400000 },
    { month: 'T7', revenue: 180000000, platformFee: 3600000 },
    { month: 'T8', revenue: 150000000, platformFee: 3000000 },
    { month: 'T9', revenue: 220000000, platformFee: 4400000 },
    { month: 'T10', revenue: 280000000, platformFee: 5600000 },
    { month: 'T11', revenue: 340000000, platformFee: 6800000 },
  ];

  protected readonly maxRevenue = 340000000;

  protected fmtCurrency(v: number): string {
    return v.toLocaleString('vi-VN') + 'đ';
  }

  protected barWidth(val: number): number {
    return Math.round((val / this.maxRevenue) * 100);
  }
}
