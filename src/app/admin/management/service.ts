import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Management } from './model';
import { environment } from "../../../environments/environment";
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl + "/admin/";
@Injectable({
  providedIn: 'root'
})
export class DataService {


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

  getData(page: number, limit: number, filter: string, sortField: string, sortOrder: string): Observable<{ data: Management[], totalCount: number, page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    return this.http.get<{ data: Management[], totalCount: number, page: number }>(BACKEND_URL + 'getAll-managements/details', { params });
  }

  getByID(id: string) {
    return this.http.get<any>(BACKEND_URL + id);
  }


  Add(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    role: string,
    address: string,
    phone: string,
    dob: string,
    gender: string,
    joinDate: string,
    addedBy: string
  ) {
    const payload = {
      name,
      email,
      password,
      passwordConfirm,
      role,
      address,
      phone,
      dob,
      gender,
      joinDate,
      addedBy
    };
  
    this.http.post<{ message: string; data: any }>(`${BACKEND_URL}/signup`, payload)
      .subscribe({

        next: response => {
          if (response) {
             this.router.navigate(['/admin/management/all-management']);
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
    role: string,
    address: string,
    phone: string,
    dob:string,
    gender: string,
    _id: string,
  ) {
    let payload = {
      name: name,
      email: email,
      role: role,
      address: address,
      phone: phone,
      dob,
      gender: gender,
    }
    this.http.patch<{ message: string; data: any }>(BACKEND_URL + _id, payload).subscribe({

      next: response => {
        if (response) {
           this.router.navigate(['/admin/management/all-management']);
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
    return this.http.put<any>(BACKEND_URL + id, {})
  }

}