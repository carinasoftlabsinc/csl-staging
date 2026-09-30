import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: 'snackbar-success',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  private showErrorMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: 'snackbar-danger',
    });

    snackBarRef.afterDismissed().subscribe(() => {
      // Navigate to the login page after the snackbar is dismissed
    });
  }

  Add(
    name: string,
    email: string,
    phone: string,
    message: string,
    address: string,
    budget: any,
    service: string
  ) {
    const payload = {
      name,
      email,
      phone,
      message,
      address,
      budget,
      service,
    };

    return this.http.post<{ status: string; message: string; data: any }>(
      `${BACKEND_URL}/admin/getContactDetails`,
      payload
    );
  }

  addService(
    name: string,
    email: string,
    phone: string,
    message: string
  ) {
    const payload = {
      name,
      email,
      phone,
      message,
    };

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}/admin/getServiceDetails`,
      payload
    );
  }
}
