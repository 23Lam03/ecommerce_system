import { Component, inject, computed, signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-product-review-management',
  standalone: true,
  imports: [],
  templateUrl: './product-review-management.html',
  styleUrl: './product-review-management.css',
})
export class ProductReviewManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);

  protected readonly searchQuery = signal('');

  protected readonly reviews = computed(() => {
    const all = this.productService.getAllReviews();
    const q = this.searchQuery().toLowerCase().trim();
    let result = [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (q) {
      result = result.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return result;
  });

  protected fmtDate(d: Date): string {
    return d.toLocaleDateString('vi-VN');
  }

  protected starClass(rating: number, star: number): string {
    return star <= rating ? 'text-amber-400' : 'text-slate-200';
  }

  protected hideReview(reviewId: string): void {
    this.productService.toggleReviewVisibility(reviewId);
    this.notification.warning('Đã ẩn đánh giá');
  }

  protected deleteReview(reviewId: string): void {
    this.productService.deleteReview(reviewId);
    this.notification.success('Đã xóa đánh giá');
  }
}
