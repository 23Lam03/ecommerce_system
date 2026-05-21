import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account-management.html',
  styleUrl: './account-management.css',
})
export class AccountManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly isSaving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }],
    phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.minLength(6)]],
    confirmPassword: [''],
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }

  protected fieldError(field: 'fullName' | 'phone' | 'address' | 'password'): string | null {
    const c = this.form.controls[field];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return 'Không được để trống';
    if (c.hasError('minlength')) return field === 'password' ? 'Tối thiểu 6 ký tự' : 'Quá ngắn';
    if (c.hasError('pattern')) return 'Số điện thoại không hợp lệ';
    return null;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    const pwd = this.form.controls.password.value;
    const confirm = this.form.controls.confirmPassword.value;
    if (pwd && pwd !== confirm) {
      this.notification.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (this.form.invalid) return;

    this.isSaving.set(true);
    setTimeout(() => {
      const raw = this.form.getRawValue();
      this.auth.updateUser({
        fullName: raw.fullName.trim(),
        phone: raw.phone.trim(),
        address: raw.address.trim(),
      });
      this.isSaving.set(false);
      this.notification.success('Cập nhật thông tin thành công');
    }, 500);
  }
}
