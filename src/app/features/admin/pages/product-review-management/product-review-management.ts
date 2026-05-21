import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-product-review-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Quản lý đánh giá" code="AD-ADM09" />',
})
export class ProductReviewManagementComponent {}
