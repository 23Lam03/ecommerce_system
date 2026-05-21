import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { User, UserStatus } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admin-customer-management',
  standalone: true,
  imports: [ConfirmDialog],
  templateUrl: './customer-management.html',
  styleUrl: './customer-management.css',
})
export class CustomerManagementComponent {
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly searchQuery = signal('');
  protected readonly editUser = signal<User | null>(null);
  protected readonly deactivateTarget = signal<User | null>(null);
  protected readonly showDeactivate = signal(false);

  protected readonly customers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.auth.allUsers().filter(u => {
      if (u.role !== 'customer') return false;
      return !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  });

  protected statusClass(s: UserStatus): string {
    return { active: 'bg-emerald-100 text-emerald-800', inactive: 'bg-slate-200 text-slate-600', banned: 'bg-red-100 text-red-800' }[s];
  }

  protected toggleStatus(user: User): void {
    const next: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    this.auth.updateUserStatus(user.id, next);
    this.notification.success(next === 'active' ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản');
  }

  protected confirmDeactivate(user: User): void {
    this.deactivateTarget.set(user);
    this.showDeactivate.set(true);
  }

  protected onDeactivateConfirmed(): void {
    const u = this.deactivateTarget();
    if (u) {
      this.auth.updateUserStatus(u.id, 'banned');
      this.notification.success('Đã khóa tài khoản');
    }
    this.showDeactivate.set(false);
    this.deactivateTarget.set(null);
  }
}
