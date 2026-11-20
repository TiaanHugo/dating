import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (adminService.authenticated()) return true;

  toast.error('Enter the admin password to continue');
  return router.createUrlTree(['/']);
};
