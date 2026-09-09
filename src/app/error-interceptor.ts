import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap((event) => {
        // Handle successful responses here if needed
        if (event instanceof HttpResponse) {
          // Do something with the response
        }
      }),
      catchError((error: HttpErrorResponse) => {
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
        return throwError(() => new Error(error.error?.message));
      })
    );
  }
}
