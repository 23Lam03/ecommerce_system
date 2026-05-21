import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Đánh giá sản phẩm" code="CTM-RVW01" />',
})
export class ProductReviewComponent {}
