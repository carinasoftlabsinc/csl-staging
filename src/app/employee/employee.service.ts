import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl + '/employee/';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
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

  checkIn() {
    return this.http.get<any>(`${BACKEND_URL}check-in`);
  }

  checkOut() {
    return this.http.get<any>(`${BACKEND_URL}check-out`);
  }

  getTodayAttendance() {
    return this.http.get<any>(`${BACKEND_URL}today/attendance`);
  }

  getAttendance(
    page = 1,
    limit = 10,
    startDate?: string,
    endDate?: string,
    sortField = 'createdAt',
    sortOrder = 'desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }

    return this.http.get<any>(`${BACKEND_URL}attendance`, { params });
  }


  getEmployeeLeaveRequests(page = 1,
    limit = 10, year?: any, month?: any): Observable<any> {
      let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      if (year && month) {
        params = params.set('year', year).set('month', month);
      }
    return this.http.get<any>(`${BACKEND_URL}get-All/leave-request`, { params });
    
  }

  getReqByID(id: string) {
    return this.http.get<any>(BACKEND_URL + 'get/leave-request/' + id);
  }


  AddLeaveReq(
    employeeName: any,
    applyDate: any,
    fromDate: any,
    toDate: any,
    halfDay: any,
    leaveType: any,
    reason: any,
  ) {
    const payload = {
      employeeName,
      applyDate,
      fromDate,
      toDate,
      halfDay,
      leaveType,
      reason,
    };
    console.log(payload)
    this.http.post<{ message: string; data: any }>(`${BACKEND_URL}create/leave-request`, payload)
      .subscribe({
        next: response => {
          if (response) {
            this.router.navigate(['/employee/LeaveRequest']);
            this.showSuccessMessage('Data added successfully');
          }
        },
        error: error => {
          console.error(error);
          this.showErrorMessage(error.message);
        }
      });
  }

  Edit(
    applyDate: any,
    fromDate: any,
    toDate: any,
    halfDay: any,
    leaveType: any,
    reason: any,
    _id: string,
  ) {
    let payload = {
      applyDate : applyDate,
      fromDate: fromDate,
      toDate: toDate,
      halfDay:halfDay,
      leaveType: leaveType,
      reason: reason,
    }
    this.http.post<{ message: string; data: any }>(BACKEND_URL + "update/leave-request/" + _id, payload).subscribe({

      next: response => {
        if (response) {
          this.router.navigate(['/employee/LeaveRequest']);
          this.showSuccessMessage('Data update successfully');
        }
      },
      error: error => {
        console.error(error);
        this.showErrorMessage(error.message);
      }
    });
  }

  deleteRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + "delete/leave-request/" + id, {})
  }

  getAllPaySlip(
    page = 1,
    limit = 10,
    year?: any,
    month?: any
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (year && month ) {
      params = params
        .set('year', year)
        .set('month', month)
    }
    return this.http.get<any>(`${BACKEND_URL}get/employee-payslip`, {
      params,
    });
  }

  getPaySlipDataByID(id: string) {
    console.log('Getting data...');
    return this.http.get<any>(BACKEND_URL + 'get/pay-slip/' + id);
  }


}
