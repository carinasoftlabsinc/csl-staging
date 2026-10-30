import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { SessionMessage, SessionSyncService } from './session-sync.service';
import { NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_URL = environment.apiUrl + '/admin/';

// setTimeout cannot wait longer than about 24.8 days; a longer wait is re-checked when the timer fires.
const MAX_TIMER_MS = 2_147_000_000;

/** Reads the expiry time (in ms) from a JWT, or null if it cannot be read. */
function tokenExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
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
    private ngZone: NgZone,
    private sessionSync: SessionSyncService
  ) {
    // Follow logins and logouts made in other open admin tabs.
    this.sessionSync.messages$.subscribe((message) => this.onOtherTab(message));

    // Browsers pause timers while the laptop sleeps or the tab is in the background,
    // so check the session again whenever the admin tab becomes visible.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.ngZone.run(() => this.checkSession());
      }
    });
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  /** True when a session exists but its expiry time has passed. */
  isSessionExpired(): boolean {
    if (!this.token) {
      return false;
    }
    const expiration = localStorage.getItem('expiration');
    return !expiration || !(new Date(expiration).getTime() > Date.now());
  }

  /** Ends the session if it has expired (on tab focus, before a request, or from the timer). */
  checkSession() {
    if (this.isSessionExpired()) {
      this.logout('expired');
    }
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
    this.http
      .post<{ token: string; expiresIn: number; data: any }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          if (!token) {
            return;
          }
          // The session ends at the earlier of the server's expiresIn and the token's own expiry.
          const expiresAt = Math.min(
            Date.now() + response.expiresIn * 1000,
            tokenExpiryMs(token) ?? Infinity
          );
          this.token = token;
          this.isAuthenticated = true;
          this.userId = response.data._id;
          this.role = response.data.role;
          this.username = response.data.name;
          this.saveAuthData(token, new Date(expiresAt), this.userId!, this.username!, this.role!);
          this.setAuthTimer(expiresAt);
          this.authStatusListener.next(true);
          this.sessionSync.announce({ type: 'login' });
          this.router.navigate(['/admin/dashboard']);
          this.snackBar.open('Login successfully', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          });
        },
        () => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const expiresAt = authInformation.expirationDate.getTime();
    if (!(expiresAt > Date.now())) {
      // Expired or unreadable saved session: remove it.
      this.clearAuthData();
      return;
    }
    if (this.isAuthenticated && this.token === authInformation.token) {
      // Already restored. The route guard calls this on every page change.
      return;
    }
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.username = authInformation.username;
    this.role = authInformation.role;
    this.setAuthTimer(expiresAt);
    this.authStatusListener.next(true);
  }

  /**
   * Ends the session. reason 'expired' is used when the server or the timer ended it.
   * fromOtherTab is true when another tab logged out; then nothing is announced back.
   */
  logout(reason: 'user' | 'expired' = 'user', fromOtherTab = false) {
    const wasLoggedIn = this.isAuthenticated || !!this.token;
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.username = null;
    this.role = null;
    clearTimeout(this.tokenTimer);
    this.tokenTimer = null;
    this.clearAuthData();
    this.router.navigate(['/signin']);
    if (wasLoggedIn && !fromOtherTab) {
      this.sessionSync.announce({ type: 'logout', reason });
    }
    // Several requests can fail at the same moment: show the message only once.
    if (!wasLoggedIn) {
      return;
    }
    this.snackBar.open(
      reason === 'expired' ? 'Session expired, please log in again' : 'Logged out',
      '',
      {
        duration: reason === 'expired' ? 4000 : 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'snackbar-danger',
      }
    );
  }

  /** Reacts to a login or logout made in another open admin tab. */
  private onOtherTab(message: SessionMessage) {
    if (message.type === 'logout') {
      if (this.isAuthenticated || this.token) {
        this.logout(message.reason, true);
      }
      return;
    }
    // Another tab logged in: load the shared session, and leave the sign-in page if this tab is on it.
    this.autoAuthUser();
    if (this.isAuthenticated && this.router.url.startsWith('/signin')) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  /** Keeps exactly one timer that ends the session at expiresAt (in ms). */
  private setAuthTimer(expiresAt: number) {
    clearTimeout(this.tokenTimer);
    const wait = Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMER_MS);
    this.tokenTimer = setTimeout(() => {
      if (Date.now() >= expiresAt) {
        this.logout('expired');
      } else {
        this.setAuthTimer(expiresAt);
      }
    }, wait);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    username: string,
    role: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      role: role,
    };
  }

  getByID() {
    return this.http.get<any>(BACKEND_URL + 'me');
  }

  updateProfilePic(profile_image: File | string) {
    let Data = new FormData();
    Data.append('profile_image', profile_image);

    this.http.patch(BACKEND_URL + 'updateMe', Data).subscribe((response) => {
      if (response) {
        this.setactiveData = true;
        const snackBarRef = this.snackBar.open(
          'Profile pic update successfully.',
          '',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          }
        );

        snackBarRef.afterDismissed().subscribe(() => {
          // this.router.navigate(['/']); // Navigate to the login page after the snackbar is dismissed
        });
      }
    });
  }

  updateData(
    aadhar_card: File | string,
    pan_card: File | string,
    bankDetails: any
  ) {
    let Data = new FormData();
    Data.append('aadhar_card', aadhar_card);
    Data.append('pan_card', pan_card);
    Data.append('bankDetails', bankDetails);

    this.http.patch(BACKEND_URL + 'updateData', Data).subscribe((response) => {
      if (response) {
        const snackBarRef = this.snackBar.open(
          'Data update successfully.',
          '',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
          }
        );

        snackBarRef.afterDismissed().subscribe(() => {
          // this.router.navigate(['/']); // Navigate to the login page after the snackbar is dismissed
        });
      }
    });
  }

  updatePassword(
    passwordCurrent: string,
    password: string,
    passwordConfirm: string
  ) {
    let Data = {
      passwordCurrent: passwordCurrent,
      password: password,
      passwordConfirm: passwordConfirm,
    };
    this.http
      .patch(BACKEND_URL + '/updateMyPassword', Data)
      .subscribe((response) => {
        if (response) {
        }
      });
  }

  set setactiveData(active: boolean) {
    this.activeData.next(active);
  }
}
