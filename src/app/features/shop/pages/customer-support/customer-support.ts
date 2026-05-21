import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';

interface Message {
  id: string;
  sender: 'customer' | 'shop';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-shop-customer-support',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-support.html',
  styleUrl: './customer-support.css',
})
export class CustomerSupportComponent {
  private readonly notification = inject(NotificationService);

  protected readonly messages = signal<Message[]>([
    { id: '1', sender: 'customer', text: 'Chào shop, cho tôi hỏi sản phẩm iPhone này còn bảo hành không?', timestamp: new Date() },
    { id: '2', sender: 'shop', text: 'Chào anh/chị! Sản phẩm iPhone được bảo hành chính hãng 12 tháng. Anh/chị cần em hỗ trợ thêm gì không ạ?', timestamp: new Date() },
  ]);
  protected newMessage = signal('');

  protected get sortedMessages(): Message[] {
    return [...this.messages()].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  protected sendMessage(): void {
    const text = this.newMessage().trim();
    if (!text) return;
    this.messages.update(msgs => [
      ...msgs,
      { id: Date.now().toString(), sender: 'shop', text, timestamp: new Date() }
    ]);
    this.newMessage.set('');
    this.notification.success('Tin nhắn đã gửi');
  }

  protected clearChat(): void {
    this.messages.set([]);
  }

  protected fmtTime(d: Date): string {
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
}
