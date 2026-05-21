import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-notification-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Quản lý thông báo" code="AD-ADM07" />',
})
export class NotificationManagementComponent {}
