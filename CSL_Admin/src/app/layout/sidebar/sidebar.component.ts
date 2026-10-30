/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, NavigationEnd } from '@angular/router';

import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
  DOCUMENT,
  ChangeDetectionStrategy
} from '@angular/core';
import { environment } from 'environments/environment';
import { ROUTES } from './sidebar-items';
// import { AuthService, Role } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { AuthService } from 'app/authentication/authServices';
import { Role } from '@core';
import { Subscription } from 'rxjs';
Role
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  imageBaseUrl = environment.imageBaseUrl;
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  userIsAuthenticated = false;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName!: string | null;
  userImg?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  isLoading = false;
  private authStatusSub!: Subscription;
  profileData: any;
  private subscription!: Subscription;
  userId!: string | null;

  showDropdown: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {
    this.elementRef.nativeElement.closest('body');
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize')
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  // callToggleMenu(event: Event, length: number) {
  //   if (length > 0) {
  //     const parentElement = (event.target as HTMLInputElement).closest('li');
  //     const activeClass = parentElement?.classList.contains('active');

  //     if (activeClass) {
  //       this.renderer.removeClass(parentElement, 'active');
  //     } else {
  //       this.renderer.addClass(parentElement, 'active');
  //     }
  //   }
  // }

  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLElement).closest('li');
  
      if (parentElement) {
        const activeClass = parentElement.classList.contains('active');
  
        if (activeClass) {
          this.renderer.removeClass(parentElement, 'active');
        } else {
          this.renderer.addClass(parentElement, 'active');
        }
      }
    }
  }
  
  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
  
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    if (this.userIsAuthenticated) {

       const storedRole = this.authService.getrole();
      // A SuperAdmin sees everything an Admin sees.
      const userRole = storedRole === Role.SuperAdmin ? Role.Admin : storedRole;
      //  this.userFullName = this.authService.getuserName();
      this.sidebarItems = ROUTES.filter(
        (x) => x.role.indexOf(userRole!) !== -1 || x.role.indexOf('All') !== -1
      );
    }

    this.authService.onActive.subscribe({
      next: (result: any) => {
        this.getProfileData()
      },
      error: () => {
        // Nothing to do; this stream does not report errors.
      },
    });

    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  getProfileData (){
    this.isLoading = true;
    this.authService.getByID().subscribe(res => {
      this.isLoading = false;
      this.profileData = res.data.data;
  });
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.profileData = [];
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  logout() {
    this.authService.logout();
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}
