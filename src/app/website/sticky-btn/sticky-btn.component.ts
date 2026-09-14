// import { Component, OnInit, HostListener, ElementRef, AfterViewInit } from '@angular/core';


// @Component({
//   selector: 'app-sticky-btn',
//   templateUrl: './sticky-btn.component.html',
//   styleUrls: ['./sticky-btn.component.scss']
// })
// export class StickyBtnComponent implements OnInit, AfterViewInit {

//   // headerHeight!: number;

//   // constructor(private el: ElementRef) {}

//   // ngOnInit(): void {
//   //   // Get the full height of the header including padding, border, and margin
//   //   const header = this.el.nativeElement.querySelector('.head5');
//   //   this.headerHeight = header.offsetHeight + 
//   //     parseFloat(getComputedStyle(header).marginTop) + 
//   //     parseFloat(getComputedStyle(header).marginBottom);
//   // }

//   // @HostListener('window:scroll', [])
//   // onWindowScroll(): void {
//   //   const scrollVal = window.scrollY;
//   //   const subnav = this.el.nativeElement.querySelector('#subnav');
//   //   if (scrollVal > this.headerHeight) {
//   //     subnav.style.position = 'fixed';
//   //     subnav.style.top = '20px';
//   //     subnav.style.right = '0';
//   //   } else {
//   //     subnav.style.position = 'absolute';
//   //     // subnav.style.top = '0px';
//   //   }
//   // }

//   private subnavInitialTop!: number;

//   constructor(private el: ElementRef) {}

//   ngOnInit(): void {}

//   ngAfterViewInit(): void {
//     // Calculate the initial top position of the subnav
//     const subnav = this.el.nativeElement.querySelector('#subnav');
//     this.subnavInitialTop = subnav.getBoundingClientRect().top + window.scrollY;
//   }

//   @HostListener('window:scroll', [])
//   onWindowScroll(): void {
//     const subnav = this.el.nativeElement.querySelector('#subnav');
//     const scrollTop = window.scrollY;

//     if (scrollTop >= this.subnavInitialTop) {
//       subnav.style.position = 'fixed';
//       subnav.style.top = '18em';
      
//     } else {
//       subnav.style.position = 'absolute';
//     }
//   }
//   }

import { Component, HostListener, ElementRef, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-sticky-btn',
    templateUrl: './sticky-btn.component.html',
    styleUrls: ['./sticky-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StickyBtnComponent {

  @Output() navToggle = new EventEmitter<boolean>();
  isOpen = false;
  openDropdown: number | null = null;

  toggleNav() {
    this.isOpen = !this.isOpen;
    this.navToggle.emit(this.isOpen);

    if (window.innerWidth < 1024) {
      // Toggle body scrolling
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
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
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = '';
    }
  }


  private subnav!: HTMLElement;
  private subnavInitialTop!: number;
  private isFixed = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.subnav = this.el.nativeElement.querySelector('#subnav');
    this.subnavInitialTop = this.subnav.getBoundingClientRect().top + window.scrollY;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
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

