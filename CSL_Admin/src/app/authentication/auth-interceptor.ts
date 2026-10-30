import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './authServices';
import { ApiError } from '../core/api-error';

/** Adds the login token, only to our own API and only when there is one (never "Bearer null"). */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }
    // The session already ran out (laptop asleep, tab in the background): end it now
    // instead of sending a request the server will reject.
    if (this.authService.isSessionExpired()) {
      this.authService.logout('expired');
      return throwError(() => new ApiError('Session expired, please log in again'));
    }
    const token = this.authService.getToken();
    if (!token) {
      return next.handle(req);
    }
    return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
}
