import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class SupportComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(5)]],
    type: ['technical', Validators.required],
    orderCode: [''],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected fieldError(field: 'subject' | 'message'): string | null {
    const c = this.form.controls[field];
    if (!c.touched) return null;
    if (c.hasError('required')) return 'Không được để trống';
    if (c.hasError('minlength')) return field === 'subject' ? 'Tiêu đề tối thiểu 5 ký tự' : 'Nội dung tối thiểu 20 ký tự';
    return null;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.form.reset({ subject: '', type: 'technical', orderCode: '', message: '' });
      this.notification.success('Đã gửi yêu cầu hỗ trợ. Chúng tôi sẽ phản hồi trong 24h.');
    }, 600);
  }
}
