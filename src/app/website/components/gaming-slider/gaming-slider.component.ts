import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-gaming-slider',
  templateUrl: './gaming-slider.component.html',
  styleUrls: ['./gaming-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GamingSliderComponent {}
