import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-product-review-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Phản hồi đánh giá" code="SH-RVW01" />',
})
export class ProductReviewManagementComponent {}
