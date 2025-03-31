import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl + '/admin/';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
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

  getAllEmployeeLeaveRequests(
    page = 1,
    limit = 10,
    year?: any,
    month?: any,
    employeeName?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (year && month && employeeName) {
      params = params
        .set('year', year)
        .set('month', month)
        .set('employeeName', employeeName);
    }
    return this.http.get<any>(`${BACKEND_URL}getAll/employees/leave-request`, {
      params,
    });
  }

  deleteRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'delete/leave-request/' + id, {});
  }

  manageReq(id: string, action: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'manage/leave-request/' + id, {
      action,
    });
  }

  // paidLeave

  getAllEmployeePaidLeaves(
    page = 1,
    limit = 10,
    employeeName?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (employeeName) {
      params = params.set('employeeName', employeeName);
    }
    return this.http.get<any>(`${BACKEND_URL}getAll/employees/padiLeaves`, {
      params,
    });
  }

  getPaidByID(id: string) {
    return this.http.get<any>(BACKEND_URL + 'get/employees/padiLeave/' + id);
  }

  UpdatePaidLeave(
    casualLeave: any,
    personalLeave: any,
    medicalLeave: any,
    maternityLeave: any,
    LWP: any,
    _id: any
  ) {
    let payload = {
      casualLeave: casualLeave,
      personalLeave: personalLeave,
      medicalLeave: medicalLeave,
      maternityLeave: maternityLeave,
      LWP: LWP,
    };
    this.http
      .post<{ message: string; data: any }>(
        BACKEND_URL + 'update/padi-Leave/' + _id,
        payload
      )
      .subscribe({
        next: (response) => {
          if (response) {
            // this.router.navigate(['/admin/employees/allEmployees']);
            this.showSuccessMessage('Data update successfully');
          }
        },
        error: (error) => {
          console.error(error);
          this.showErrorMessage(error.message);
        },
      });
  }
}
