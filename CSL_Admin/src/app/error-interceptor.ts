import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../environments/environment";
import { AuthService } from "./authentication/authServices";
import { ApiError } from "./core/api-error";
import { LoggerService } from "./core/service/logger.service";

// These endpoints answer 401 for a wrong password; that must not end the session.
const PASSWORD_CHECKS = /\/admin\/(login|updateMyPassword)$/;

/** Shows API errors to the user, logs them once, and ends the session on a 401. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private logger: LoggerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const path = req.url.split('?')[0];

        // 401 from our API = the token was rejected (expired, invalid, deactivated account, password changed).
        // End the session and go to sign-in; logout() shows the single "Session expired" message. Not logged.
        if (error.status === 401 && req.url.startsWith(environment.apiUrl) && !PASSWORD_CHECKS.test(path)) {
          this.authService.logout('expired');
          return throwError(() => new ApiError('Session expired, please log in again'));
        }

        // Development: short line + full error; production: the short line only.
        const shortPath = path.startsWith(environment.apiUrl) ? path.slice(environment.apiUrl.length) : path;
        this.logger.error(`Request failed: ${req.method} ${shortPath} (${error.status || 'network error'})`, error);

        let errorMessage = "An unknown error occurred!";

        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, '', {
            duration: 2500,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass:'snackbar-danger',
          });
        return throwError(() => new ApiError(error.error?.message));
      })
    );
  }
}
