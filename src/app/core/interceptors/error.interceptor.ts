import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 401:
          notification.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          router.navigate(['/auth/login']);
          break;
        case 403:
          notification.error('Bạn không có quyền truy cập trang này');
          break;
        case 404:
          notification.error('Không tìm thấy tài nguyên yêu cầu');
          break;
        case 500:
          notification.error('Lỗi máy chủ, vui lòng thử lại sau');
          break;
        default:
          notification.error('Đã xảy ra lỗi không xác định');
      }
      return throwError(() => error);
    })
  );
};
