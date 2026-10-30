import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './authServices';

/** Sign-in page only for visitors who are not logged in; a logged-in user goes to the dashboard. */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  authService.autoAuthUser();
  return authService.getIsAuth() ? inject(Router).createUrlTree(['/admin/dashboard']) : true;
};
