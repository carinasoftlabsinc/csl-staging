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
export class PaySlipServices {
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

  getAllPaySlip(
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
    return this.http.get<any>(`${BACKEND_URL}getAll/pay-slip`, {
      params,
    });
  }

  getPaySlipDataByID(id: string) {
    return this.http.get<any>(BACKEND_URL + 'get/paySlip-data/' + id);
  }

  getByID(id: string) {
    return this.http.get<any>(BACKEND_URL + 'get/pay-slip/' + id);
  }

  AddPaySlipData(
    employeeId:any,
    salaryMonth:any,
    salaryYear:any,
    basicWage:any,
    HRA:any,
    conveyanceAllowance:any,
    medicalAllowance:any,
    otherAllowance:any,
    EPF:any,
    ESI_HealthInsurance:any,
    professionalTax:any,
    loanRecovery:any,
    leaveDeductionAmount:any,
    totalEarning:any,
    totalDeduction:any,
    netSalary:any
  ) {
    const payload = {
      employeeId,
      salaryMonth,
      salaryYear,
      basicWage,
      HRA,
      conveyanceAllowance,
      medicalAllowance,
      otherAllowance,
      EPF,
      ESI_HealthInsurance,
      professionalTax,
      loanRecovery,
      leaveDeductionAmount,
      totalEarning,
      totalDeduction,
      netSalary
    };
  
    this.http.post<{ message: string; data: any }>(`${BACKEND_URL}create/pay-slip`, payload)
      .subscribe({

        next: response => {
          if (response) {
             this.router.navigate(['/admin/payroll/pay-slip']);
            this.showSuccessMessage('Data added successfully');
          }
        },
        error: error => {
          console.error(error);
          this.showErrorMessage(error.message);
        }
      });
  }

  UpdatePaySlipData(
    basicWage:any,
    HRA:any,
    conveyanceAllowance:any,
    medicalAllowance:any,
    otherAllowance:any,
    EPF:any,
    ESI_HealthInsurance:any,
    professionalTax:any,
    loanRecovery:any,
    leaveDeductionAmount:any,
    totalEarning:any,
    totalDeduction:any,
    netSalary:any,
    _id: string,
  ) {
    const payload = {
      basicWage,
      HRA,
      conveyanceAllowance,
      medicalAllowance,
      otherAllowance,
      EPF,
      ESI_HealthInsurance,
      professionalTax,
      loanRecovery,
      leaveDeductionAmount,
      totalEarning,
      totalDeduction,
      netSalary
    };
  
    this.http.post<{ message: string; data: any }>(`${BACKEND_URL}update/pay-slip/` + _id, payload)
      .subscribe({

        next: response => {
          if (response) {
             this.router.navigate(['/admin/payroll/pay-slip']);
            this.showSuccessMessage('Data update successfully');
          }
        },
        error: error => {
          console.error(error);
          this.showErrorMessage(error.message);
        }
      });
  }

  delete(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'deletePaySlip/' + id, {});
  }
 
}
