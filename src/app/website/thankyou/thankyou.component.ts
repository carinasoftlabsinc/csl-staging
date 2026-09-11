import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss'],
    standalone: false
})
export class ThankyouComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
