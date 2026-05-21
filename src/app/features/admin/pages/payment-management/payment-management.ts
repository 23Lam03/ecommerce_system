import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-payment-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Quản lý thanh toán" code="AD-ADM05" />',
})
export class PaymentManagementComponent {}
