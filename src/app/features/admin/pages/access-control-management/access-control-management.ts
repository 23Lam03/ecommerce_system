import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AdminStaff } from '../../../../core/models/user.model';

const ALL_PERMISSIONS = [
  { key: 'view_dashboard', label: 'Xem Dashboard' },
  { key: 'manage_stores', label: 'Quản lý Cửa hàng' },
  { key: 'manage_products', label: 'Quản lý Sản phẩm' },
  { key: 'manage_orders', label: 'Quản lý Đơn hàng' },
  { key: 'manage_customers', label: 'Quản lý Khách hàng' },
  { key: 'manage_payments', label: 'Quản lý Thanh toán' },
  { key: 'manage_promotions', label: 'Quản lý Khuyến mãi' },
  { key: 'manage_reviews', label: 'Quản lý Đánh giá' },
  { key: 'manage_support', label: 'Quản lý Hỗ trợ' },
  { key: 'manage_notifications', label: 'Gửi Thông báo' },
  { key: 'manage_financial', label: 'Xem Báo cáo Tài chính' },
  { key: 'manage_access', label: 'Phân quyền truy cập' },
];

@Component({
  selector: 'app-admin-access-control-management',
  standalone: true,
  imports: [],
  templateUrl: './access-control-management.html',
  styleUrl: './access-control-management.css',
})
export class AccessControlManagementComponent {
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly staffList = signal<AdminStaff[]>([
    { id: '1', userId: 'USR003', fullName: 'Lê Minh Tuấn', email: 'admin@demo.com', permissions: ALL_PERMISSIONS.map(p => p.key), status: 'active' },
    { id: '2', userId: 'USR007', fullName: 'Đỗ Thị Mai', email: 'mai@ecomart.com', permissions: ['view_dashboard', 'manage_orders', 'manage_customers', 'manage_support'], status: 'active' },
    { id: '3', userId: 'USR008', fullName: 'Hoàng Văn Phong', email: 'phong@ecomart.com', permissions: ['view_dashboard', 'manage_stores', 'manage_products'], status: 'active' },
    { id: '4', userId: 'USR009', fullName: 'Trần Thị Hương', email: 'huong@ecomart.com', permissions: ['view_dashboard', 'manage_payments', 'manage_financial'], status: 'inactive' },
  ]);

  protected readonly allPermissions = ALL_PERMISSIONS;

  protected togglePermission(staffId: string, permission: string): void {
    this.staffList.update(list =>
      list.map(s => {
        if (s.id !== staffId) return s;
        const has = s.permissions.includes(permission);
        return {
          ...s,
          permissions: has
            ? s.permissions.filter(p => p !== permission)
            : [...s.permissions, permission],
        };
      })
    );
  }

  protected hasPermission(staffId: string, permission: string): boolean {
    return this.staffList().find(s => s.id === staffId)?.permissions.includes(permission) ?? false;
  }

  protected toggleStaffStatus(staffId: string): void {
    this.staffList.update(list =>
      list.map(s => s.id === staffId
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
      )
    );
    this.notification.success('Đã cập nhật trạng thái nhân viên');
  }

  protected selectAll(staffId: string): void {
    this.staffList.update(list =>
      list.map(s => s.id === staffId
        ? { ...s, permissions: ALL_PERMISSIONS.map(p => p.key) }
        : s
      )
    );
  }

  protected deselectAll(staffId: string): void {
    this.staffList.update(list =>
      list.map(s => s.id === staffId
        ? { ...s, permissions: [] }
        : s
      )
    );
  }
}
