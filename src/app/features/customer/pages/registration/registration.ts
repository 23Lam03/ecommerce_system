import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  if (password && confirm && password !== confirm) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class RegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      phone: ['', [Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  protected fieldError(field: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[field];
    if (!control.touched && !control.dirty) return null;

    if (control.hasError('required')) {
      const labels: Record<string, string> = {
        fullName: 'Họ và tên',
        email: 'Email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
      };
      return `${labels[field] ?? 'Trường này'} không được để trống`;
    }
    if (control.hasError('minlength')) {
      if (field === 'fullName') return 'Họ và tên tối thiểu 2 ký tự';
      if (field === 'password') return 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (control.hasError('maxlength')) return 'Nội dung quá dài';
    if (control.hasError('email')) return 'Email không đúng định dạng';
    if (control.hasError('pattern')) return 'Số điện thoại không hợp lệ (VD: 0901234567)';
    return null;
  }

  protected getConfirmPasswordError(): string | null {
    const control = this.form.controls.confirmPassword;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'Vui lòng xác nhận mật khẩu';
    if (this.form.hasError('passwordMismatch')) return 'Mật khẩu xác nhận không khớp';
    return null;
  }

  protected togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword.update(v => !v);
    } else {
      this.showConfirmPassword.update(v => !v);
    }
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const raw = this.form.getRawValue();

    setTimeout(() => {
      const result = this.auth.register({
        fullName: raw.fullName.trim(),
        email: raw.email.trim().toLowerCase(),
        password: raw.password,
        confirmPassword: raw.confirmPassword,
        phone: raw.phone.trim() || '0900000000',
        role: 'customer',
      });

      this.isSubmitting.set(false);

      if (result.success) {
        this.notification.success(result.message);
        this.router.navigate(['/cart']);
      } else {
        this.notification.error(result.message);
      }
    }, 600);
  }
}
