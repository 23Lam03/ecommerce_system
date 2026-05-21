import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyVndPipe],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ProductReviewComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected selectedRating = signal(0);
  protected hoveredRating = signal(0);

  protected readonly form = this.fb.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  protected product = this.productService.getProductById('PRD001');

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.product = this.productService.getProductById(productId);
    }
  }

  protected setRating(star: number): void {
    this.selectedRating.set(star);
    this.form.controls.rating.setValue(star);
  }

  protected fieldError(): string | null {
    const c = this.form.controls.comment;
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return 'Vui lòng nhập nhận xét của bạn';
    if (c.hasError('minlength')) return 'Nhận xét tối thiểu 10 ký tự';
    if (c.hasError('maxlength')) return 'Nhận xét tối đa 1000 ký tự';
    return null;
  }

  protected getRatingError(): string | null {
    const c = this.form.controls.rating;
    if (!c.touched) return null;
    if (c.hasError('required') || c.value === 0) return 'Vui lòng chọn số sao đánh giá';
    return null;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.selectedRating() === 0) {
      if (this.selectedRating() === 0) {
        this.notification.error('Vui lòng chọn số sao đánh giá');
      }
      return;
    }

    this.isSubmitting.set(true);
    const user = this.auth.currentUser();
    const product = this.product;

    setTimeout(() => {
      if (product) {
        this.productService.addReview({
          productId: product.id,
          productName: product.name,
          userId: user?.id ?? 'USR001',
          userName: user?.fullName ?? 'Khách hàng',
          userAvatar: user?.avatar ?? '',
          rating: this.selectedRating(),
          comment: this.form.getRawValue().comment.trim(),
        });
        this.notification.success('Cảm ơn bạn đã đánh giá sản phẩm!');
      }
      this.isSubmitting.set(false);
      this.router.navigate(['/orders']);
    }, 600);
  }
}
