import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, RouterLink, GradientButtonComponent]
})
export class ThankyouComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
