import { Component, inject, computed, signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductReview } from '../../../../core/models/product.model';

@Component({
  selector: 'app-shop-product-review-management',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './product-review-management.html',
  styleUrl: './product-review-management.css',
})
export class ProductReviewManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly searchQuery = signal('');
  protected readonly replyingTo = signal<string | null>(null);
  protected readonly replyText = signal('');

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly reviews = computed(() => {
    const all = this.productService.getReviewsByShop(this.shopId());
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return all
      .filter(r => r.productName.toLowerCase().includes(q) || r.userName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected starClass(rating: number, star: number): string {
    return star <= rating ? 'text-amber-400' : 'text-slate-200';
  }

  protected startReply(reviewId: string): void {
    this.replyingTo.set(reviewId);
    this.replyText.set('');
  }

  protected cancelReply(): void {
    this.replyingTo.set(null);
    this.replyText.set('');
  }

  protected submitReply(reviewId: string): void {
    const text = this.replyText().trim();
    if (!text) {
      this.notification.warning('Vui lòng nhập nội dung phản hồi');
      return;
    }
    this.productService.replyToReview(reviewId, text);
    this.notification.success('Đã gửi phản hồi');
    this.replyingTo.set(null);
    this.replyText.set('');
  }
}
