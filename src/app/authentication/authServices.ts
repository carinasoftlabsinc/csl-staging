import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { Role } from "@core";
import { NgZone } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

const BACKEND_URL = environment.apiUrl + "/admin/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private userId!: string | null;
  private username!: string | null;
  private role!: string | null;
  private authStatusListener = new Subject<boolean>();
  isLoading!: string | null;

  public isLoadingsubject = new Subject<boolean>();


  // private profileDataSubject = new BehaviorSubject<any>(null);
  // profileData$ = this.profileDataSubject.asObservable();

  activeData = new BehaviorSubject<boolean | null>(null);
  onActive = this.activeData.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private ngZone: NgZone 

  ) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getrole() {
    return this.role;
  }

  getUserId() {
    return this.userId;
  }

  getuserName() {
    return this.username;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string; expiresIn: number; data: any }>(
      BACKEND_URL + "login",
      authData
    ).subscribe(
      response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.data._id;
          this.role = response.data.role;
          this.username = response.data.name;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId!, this.username!, this.role!);
          setTimeout(() => {
            if (response.data.role === Role.All || response.data.role === Role.Admin) {
              this.router.navigate(['/admin/dashboard']);
            } else if (response.data.role === Role.HR) {
              this.router.navigate(['/admin/dashboard']);
            }
            else if (response.data.role === Role.Manager) {
              this.router.navigate(['/admin/dashboard']);
            }
            else if (response.data.role === Role.Employee) {
              this.router.navigate(['/employee/dashboard']);
            } else if (response.data.role === Role.Client) {
              this.router.navigate(['/client/dashboard']);
            } else {
              this.router.navigate(['/hrms/signin']);
            }
            const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
              'Login successfully',
              '',
              {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackbar-success',
              }
            );
            snackBarRef.afterOpened().subscribe(() => {
              // Add any additional logic here to be executed after the snackbar is opened.
              // This will ensure that the snackbar is displayed for the specified duration before navigating.
            });
          }, 1000);
        }
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    // console.log(authInformation)
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.role = authInformation.role;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.username = null;
    this.role = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/signin"]);
    this.snackBar.open('Logged out', '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'snackbar-danger',
    });
  }


  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, role: string) {

    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      role: role
    };
  }



  forgotPassword(email: any) {
    console.log(email);
    this.http
      .post<{ message: string, status: string }>(
        BACKEND_URL + "forgot-password",
        email
      )
      .subscribe(response => {
        if (response.status === "success") { // Use === for comparison
          // this.isLoading = false;
          this.isLoadingsubject.next(true);
          setTimeout(() => {
            const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
              'Successfully sent password reset link to your email👍.',
              '',
              {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackbar-success',
              }
            );
          }, 1000);
        }
      },
      error => {
        this.authStatusListener.next(false);
      });
  }
  
  // forgotPassword(email: any) {
  //   console.log(email);
  //   this.http
  //     .post<{ message: string, status: string }>(
  //       BACKEND_URL + "forgot-password",
  //       email
  //     )
  //     .subscribe(response => {
  //       if (response.status === "success") {
  //         // Use ngZone.run to run code inside the Angular zone
  //         this.ngZone.run(() => {
  //           this.isLoadingsubject.next(true);
  //           this.toast.info('Successfully sent password reset link to your email👍.', "Reset Link", {
  //             timeOut: 6000,
  //             closeButton: true,
  //           });
  //         });
  //       }
  //     },
  //     error => {
  //       this.authStatusListener.next(false);
  //     });
  // }
  

  resetPassword(password: string, passwordConfirm: string, token: string) {
    const resetData = { password: password, passwordConfirm: passwordConfirm };
    this.http
      .patch<{ data: any }>(
        BACKEND_URL + 'resetPassword' + '/' + token,
        resetData
      )
      .subscribe(responce => {
       
        setTimeout(() => {
           const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
          'Your password is successfully reset👍.',
          '',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          }
        );
          this.router.navigate(['signin']);
        }, 300);

      })
  }

  getByID() {
    return this.http.get<any>(BACKEND_URL + 'me');
  }

  updateProfilePic(
    profile_image: File | string,
  ) {
    let Data = new FormData();
    Data.append('profile_image', profile_image);

    this.http
      .patch(BACKEND_URL + 'updateMe', Data)
      .subscribe(response => {
        if (response) {
          this.setactiveData = true;
          const snackBarRef = this.snackBar.open('Profile pic update successfully.', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          });

          snackBarRef.afterDismissed().subscribe(() => {
            console.log(response)
            // this.router.navigate(['/']); // Navigate to the login page after the snackbar is dismissed
          });
        }
      });
  }

  updateData(
    aadhar_card: File | string,
    pan_card: File | string,
    bankDetails:any
  ) {

    let Data = new FormData();
    Data.append('aadhar_card', aadhar_card);
    Data.append('pan_card', pan_card);
    Data.append('bankDetails', bankDetails);

    this.http
      .patch(BACKEND_URL + 'updateData', Data)
      .subscribe(response => {
        if (response) {
          const snackBarRef = this.snackBar.open('Data update successfully.', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          });

          snackBarRef.afterDismissed().subscribe(() => {
            console.log(response)
            // this.router.navigate(['/']); // Navigate to the login page after the snackbar is dismissed
          });
        }
      });
  }


  updatePassword(
    passwordCurrent: string,
    password: string,
    passwordConfirm: string,
  ) {
    let Data = {
      passwordCurrent: passwordCurrent,
      password: password,
      passwordConfirm: passwordConfirm
    }
    console.log(Data)
    this.http
      .patch(BACKEND_URL + '/updateMyPassword', Data)
      .subscribe(response => {
        if (response) {
        }
      });
  }

  set setactiveData(active: boolean) {
    this.activeData.next(active);
  }
}


