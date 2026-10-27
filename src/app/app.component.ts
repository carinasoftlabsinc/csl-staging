import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
  NgZone,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { AnalyticsService } from '@core/service/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  private readonly zone = inject(NgZone);
  private readonly analyticsService = inject(AnalyticsService);
  currentUrl!: string;

  @ViewChild('cursorDot') cursorDot!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorOutline') cursorOutline!: ElementRef<HTMLDivElement>;

  constructor(
    public _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.analyticsService.trackMetaPageView(routerEvent.urlAfterRedirects);
        // Start each new page at the top, but keep the position when only the query changes
        // (e.g. switching portfolio tabs with ?category=...).
        const path = routerEvent.urlAfterRedirects.split(/[?#]/)[0];
        if (isPlatformBrowser(this.platformId) && path !== this.lastPath) {
          window.scrollTo(0, 0);
        }
        this.lastPath = path;
      }
    });
  }

  /** Path of the last finished navigation, without query string or fragment. */
  private lastPath = '';

  ngOnInit() {
    /* empty */
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Outside the Angular zone: the cursor only moves DOM nodes, so a mouse move must not run change detection,
      // and the GSAP animation loop must not keep the app from becoming stable (that blocks hydration event replay).
      this.zone.runOutsideAngular(() => document.addEventListener('mousemove', this.onMouseMove, { passive: true }));
    }
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.cursorDot?.nativeElement || !this.cursorOutline?.nativeElement) {
      return;
    }

    // Move inner dot instantly
    gsap.to(this.cursorDot.nativeElement, {
      x: event.clientX,
      y: event.clientY,
      duration: 0,
    });

    // Move outer circle with slight delay for a smooth trailing effect
    gsap.to(this.cursorOutline.nativeElement, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.2,
      ease: 'power2.out',
    });
  };
}
