import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-promotion-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Quản lý khuyến mãi" code="AD-ADM10" />',
})
export class PromotionManagementComponent {}
