import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  readonly isOpen = input(false);
  readonly title = input('Xác nhận');
  readonly message = input('Bạn có chắc chắn muốn thực hiện hành động này?');
  readonly confirmText = input('Xác nhận');
  readonly cancelText = input('Hủy');
  readonly danger = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
