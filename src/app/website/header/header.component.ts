import { Component, Output, EventEmitter, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent {
  @Output() navToggle = new EventEmitter<boolean>();
  isOpen = false;
  openDropdown: number | null = null;

  constructor(private router: Router) {
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

    // Toggle body scrolling for smaller screens
    if (window.innerWidth < 1024) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleDropdown(index: number) {
    this.openDropdown = this.openDropdown === index ? null : index;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Reset body overflow when screen size changes to larger than 1024px
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = '';
    }
  }

  private resetBodyOverflow() {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  }

   @Input() isWhiteBackground: boolean = false; 

}
