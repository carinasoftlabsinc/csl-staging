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

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ToggleSwitchComponent implements OnInit {
  isChecked: boolean = false;

  ngOnInit(): void {
    setInterval(() => {
      this.isChecked = !this.isChecked;
    }, 2000);
  }
}
