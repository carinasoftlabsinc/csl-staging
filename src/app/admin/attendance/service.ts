import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'environments/environment.development';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAttenDance } from './model';
const BACKEND_URL = environment.apiUrl + "/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminAttendanceService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router,) { }

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: 'snackbar-success',
    });

    snackBarRef.afterDismissed().subscribe(() => {
    });
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

  getTodayAttendance(page: number, limit: number, employeeName: string ): Observable<{ attendanceRecords: any, totalCount: number, page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('employeeName', employeeName)

    return this.http.get<{ attendanceRecords: any, totalCount: number, page: number }>(BACKEND_URL + 'all-attendance/today', { params });
  }

  getAllAttendance(page: number, limit: number, startDate?: string,
    endDate?: string, employeeName?: string ): Observable<{ attendanceRecords: any, totalCount: number, page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (startDate) {
      params = params.set('startDate', startDate);
    }
  
    if (endDate) {
      params = params.set('endDate', endDate);
    }
  
    if (employeeName) {
      params = params.set('employeeName', employeeName);
    }
  
    return this.http.get<{ attendanceRecords: any, totalCount: number, page: number }>(BACKEND_URL + 'allAttendance/employee', { params });
  }
}