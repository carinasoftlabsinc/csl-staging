import {
  Component,
  HostListener,
  ElementRef,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sticky-btn',
  templateUrl: './sticky-btn.component.html',
  styleUrls: ['./sticky-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StickyBtnComponent implements AfterViewInit {
  @Output() navToggle = new EventEmitter<boolean>();
  isOpen = false;
  openDropdown: number | null = null;
  private subnav!: HTMLElement;
  private subnavInitialTop: number = 0;
  private isFixed = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subnav = this.el.nativeElement.querySelector('#subnav');
      if (this.subnav) {
        this.subnavInitialTop =
          this.subnav.getBoundingClientRect().top + window.scrollY;
      }
    }
  }

  toggleNav() {
    this.isOpen = !this.isOpen;
    this.navToggle.emit(this.isOpen);

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 1024) {
        if (this.isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
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

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId) && this.subnav) {
      const scrollTop = window.scrollY;

      if (scrollTop >= this.subnavInitialTop && !this.isFixed) {
        this.subnav.classList.add('fixed');
        this.isFixed = true;
      } else if (scrollTop < this.subnavInitialTop && this.isFixed) {
        this.subnav.classList.remove('fixed');
        this.isFixed = false;
      }
    }
  }
}
