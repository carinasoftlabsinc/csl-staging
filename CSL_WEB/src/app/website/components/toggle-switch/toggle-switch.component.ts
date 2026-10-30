// import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';

// @Component({
//   selector: 'app-toggle-switch',
//   templateUrl: './toggle-switch.component.html',
//   styleUrls: ['./toggle-switch.component.scss'],
// })
// export class ToggleSwitchComponent implements OnInit, AfterViewInit {
//   constructor(private renderer: Renderer2) {}

//   ngOnInit(): void {}

//   ngAfterViewInit(): void {
//     setInterval(() => {
//       const toggleCheckbox = document.querySelector(
//         '.toggle-checkbox'
//       ) as HTMLInputElement;
//       toggleCheckbox.checked = !toggleCheckbox.checked;
//     }, 2000);
//   }

//   preventToggle(event: Event): void {
//     event.preventDefault();
//   }
// }

import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule]
})
export class ToggleSwitchComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private intervalId?: ReturnType<typeof setInterval>;

  isChecked: boolean = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Outside the Angular zone: a never-ending timer inside it keeps the app from ever becoming stable,
    // which blocks hydration event replay (e.g. an early click on the menu button was lost).
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.zone.run(() => (this.isChecked = !this.isChecked)), 2000);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
