import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from './authentication/authServices';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent {
  userIsAuthenticated = false;
  currentUrl!: string;
  constructor(public _router: Router,private authService: AuthService,) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }
  ngOnInit() {
    this.authService.autoAuthUser(); 
    
  }
}
