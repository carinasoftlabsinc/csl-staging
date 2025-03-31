import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { LanguageService, InConfiguration } from '@core';
import { AuthService } from 'app/authentication/authServices';
import { EmployeesService } from 'app/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
    imageBaseUrl = environment.imageBaseUrl;
  public config!: InConfiguration;
  userImg?: string;
  userName!: string | null;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement: HTMLElement | undefined;
  isFullScreen = false;
  isLoading!: boolean;
  profileData: any;
  todayAttenDance!: any;
  timer: any;
  totalHours: any;
  totalSeconds: any;
  totalMinutes: any;

  userRole!: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private empService: EmployeesService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

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

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
  ];
  notifications: Notifications[] = [
    {
      message: 'Please check your mail',
      time: '14 mins ago',
      icon: 'mail',
      color: 'nfc-green',
      status: 'msg-unread',
    },
    {
      message: 'New Employee Added..',
      time: '22 mins ago',
      icon: 'person_add',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Your leave is approved!! ',
      time: '3 hours ago',
      icon: 'event_available',
      color: 'nfc-orange',
      status: 'msg-read',
    },
    {
      message: 'Lets break for lunch...',
      time: '5 hours ago',
      icon: 'lunch_dining',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Employee report generated',
      time: '14 mins ago',
      icon: 'description',
      color: 'nfc-green',
      status: 'msg-read',
    },
    {
      message: 'Please check your mail',
      time: '22 mins ago',
      icon: 'mail',
      color: 'nfc-red',
      status: 'msg-read',
    },
    {
      message: 'Salary credited...',
      time: '3 hours ago',
      icon: 'paid',
      color: 'nfc-purple',
      status: 'msg-read',
    },
  ];

  ngOnInit() {
    this.config = this.configService.configData;

    this.userRole = this.authService.getrole();

    if (this.userRole === 'Admin' || this.userRole === 'HR' || this.userRole === 'Manager') {
      this.homePage = 'admin/dashboard';
    } else if (this.userRole === 'Client') {
      this.homePage = 'client/dashboard';
    } else if (this.userRole === 'Employee') {
      this.getTodayAttendance();
      this.homePage = 'employee/dashboard';
    } else {
      this.homePage = 'admin/dashboard/main';
    }

    this.authService.onActive.subscribe({
      next: (result: any) => {
        this.getProfileData()
      },
      error: (err: any) => {
        console.error;
      },
    });

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  getProfileData() {
    this.isLoading = true;
    this.authService.getByID().subscribe(res => {
      this.isLoading = false;
      this.profileData = res.data.data;
    });
  }

  getTodayAttendance() {
    this.isLoading = true;
    this.empService.getTodayAttendance().subscribe({
      next: response => {
        if (response) {
          console.log(response)
          this.isLoading = false;
          this.todayAttenDance = response;
          if (this.todayAttenDance && this.todayAttenDance.checkInTime) {
            this.startWorkCounter(this.todayAttenDance.checkInTime);
          } else {
            console.log("counter not start");
          }
        }
      },
      error: error => {
        console.error(error.message);
      }
    });
  }

  checkIn() {
    this.isLoading = true;
    this.empService.checkIn().subscribe({
      next: response => {
        if (response) {
          this.isLoading = false;
          this.getTodayAttendance();
          this.showSuccessMessage("Check-IN Successfully");
        }
      },
      error: error => {
        console.error(error);
        this.showErrorMessage(error.message);
      }
    });
  }

  startWorkCounter(checkInTime: string) {
    const checkInTimestamp = new Date(checkInTime).getTime();
    this.timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const totalMilliseconds = currentTime - checkInTimestamp;
      this.totalHours = Math.floor(totalMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
      this.totalMinutes = Math.floor(totalMilliseconds / 60000) % 60; // 1 minute = 60000 milliseconds
      this.totalSeconds = Math.floor(totalMilliseconds / 1000) % 60; // 1 second = 1000 milliseconds
      // this.todayAttenDance.totalHours = totalHours;
      // this.todayAttenDance.totalMinutes = totalMinutes;
      // this.todayAttenDance.totalSeconds = totalSeconds;
    }, 1000); // Update the total hours every second
  }

  checkOut() {
    clearInterval(this.timer); // Stop the work counter
    this.isLoading = true;
    this.empService.checkOut().subscribe({
      next: response => {
        if (response) {
          this.isLoading = false;
          this.getTodayAttendance();
          this.showSuccessMessage("Check-Out Successfully");
        }
      },
      error: error => {
        console.error(error);
        this.showErrorMessage(error.message);
      }
    });
  }


  formatTime(hours: number, minutes: number, seconds: number): string {
    const formattedHours = hours ? hours.toString() : '00';
    const formattedMinutes = minutes ? minutes.toString().padStart(2, '0') : '00';
    const formattedSeconds = seconds ? seconds.toString().padStart(2, '0') : '00';
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }



  callFullscreen() {
    if (!this.isFullScreen) {
      this.docElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  logout() {
    this.authService.logout();
  }
}
