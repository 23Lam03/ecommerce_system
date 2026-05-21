export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationTarget = 'all' | 'shops' | 'customers' | 'specific';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
  targetIds: string[];
  isRead: boolean;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  reply: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  banner: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  code: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  shopId: string | null;
  usageCount: number;
  usageLimit: number;
}
