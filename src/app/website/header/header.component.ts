import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  Input,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HeaderComponent {
  @Output() navToggle = new EventEmitter<boolean>();
  isOpen = false;
  openDropdown: number | null = null;
  @Input() isWhiteBackground: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Listen to router events and reset body overflow on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetBodyOverflow();
      }
    });
  }

  toggleNav() {
    this.isOpen = !this.isOpen;
    this.navToggle.emit(this.isOpen);

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 1024) {
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleDropdown(index: number) {
    this.openDropdown = this.openDropdown === index ? null : index;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = '';
      }
    }
  }

  private resetBodyOverflow() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 1024) {
        document.body.style.overflow = '';
        this.isOpen = false;
      }
    }
  }
}
