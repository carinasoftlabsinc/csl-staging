import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  currentUrl!: string;
  constructor(public _router: Router) {
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
    /* empty */
  }

  // custom cursor
  
  @ViewChild('cursorDot') cursorDot!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorOutline') cursorOutline!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event: MouseEvent) => {
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
      ease: "power2.out",
    });
  };

  // custom cursor end
}
