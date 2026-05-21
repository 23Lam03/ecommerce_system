import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-financial-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Tài chính cửa hàng" code="SH-FIN01" />',
})
export class FinancialManagementComponent {}
