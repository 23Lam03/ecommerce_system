import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected fieldError(field: 'email' | 'password'): string | null {
    const control = this.form.controls[field];
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return field === 'email' ? 'Email không được để trống' : 'Mật khẩu không được để trống';
    if (control.hasError('email')) return 'Email không đúng định dạng';
    if (control.hasError('minlength')) return 'Mật khẩu tối thiểu 6 ký tự';
    return null;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const { email, password } = this.form.getRawValue();

    setTimeout(() => {
      const result = this.auth.login({ email: email.trim().toLowerCase(), password });
      this.isSubmitting.set(false);

      if (result.success) {
        this.notification.success(result.message);
        const role = this.auth.userRole();
        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'shop') this.router.navigate(['/shop']);
        else this.router.navigate(['/cart']);
      } else {
        this.notification.error(result.message);
      }
    }, 500);
  }

  protected fillDemo(role: 'customer' | 'shop' | 'admin'): void {
    const demos = {
      customer: { email: 'customer@demo.com', password: '123456' },
      shop: { email: 'shop@demo.com', password: '123456' },
      admin: { email: 'admin@demo.com', password: '123456' },
    };
    this.form.patchValue(demos[role]);
  }
}
