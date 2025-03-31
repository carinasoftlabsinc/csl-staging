import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from "../../../environments/environment";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl + "/admin/";
@Injectable({
  providedIn: 'root'
})
export class EmployeesDataService {


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

  getEmployees(): Observable<any> {
    return this.http.get<any>(BACKEND_URL + "getAll-employees/data");
  }

  getData(page: number, limit: number, filter: string, sortField: string, sortOrder: string): Observable<{ data: any, totalCount: number, page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    return this.http.get<{ data: any, totalCount: number, page: number }>(BACKEND_URL + 'getAll-employees/details', { params });
  }

  getByID(id: string) {
    return this.http.get<any>(BACKEND_URL + "employee/" + id);
  }


  Add(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    role: string,
    department: string,
    designation: string,
    phone: string,
    address: string,
    dob: string,
    gender: string,
    joinDate: string,
    addedBy: string,
    graduation: string,
    shifts: string,
    isProbation: any
  ) {
    const payload = {
      name,
      email,
      password,
      passwordConfirm,
      department,
      designation,
      role,
      address,
      phone,
      dob,
      gender,
      joinDate,
      addedBy,
      graduation,
      shifts,
      isProbation
    };
    console.log(payload)
    this.http.post<{ message: string; data: any }>(`${BACKEND_URL}/add-employee`, payload)
      .subscribe({

        next: response => {
          if (response) {
            this.router.navigate(['/admin/employees/allEmployees']);
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
    name: string,
    email: string,
    department: string,
    designation: string,
    role: string,
    address: string,
    phone: string,
    dob: string,
    gender: string,
    graduation: string,
    shifts: string,
    _id: string
  ) {
    let payload = {
      name: name,
      email: email,
      department: department,
      designation: designation,
      role: role,
      address: address,
      phone: phone,
      dob: dob,
      gender: gender,
      graduation: graduation,
      shifts: shifts
    }
    this.http.patch<{ message: string; data: any }>(BACKEND_URL + "employee/" + _id, payload).subscribe({

      next: response => {
        if (response) {
          this.router.navigate(['/admin/employees/allEmployees']);
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
    return this.http.put<any>(BACKEND_URL + "employee/" + id, {})
  }

  probation(id: string, isProbation: any): Observable<any> {
    return this.http.put<any>(BACKEND_URL + "probation/" + id, { isProbation })
  }

}