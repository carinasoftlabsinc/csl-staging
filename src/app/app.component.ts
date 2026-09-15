import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
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
        /* empty */
      }
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    /* empty */
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.onMouseMove);
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
