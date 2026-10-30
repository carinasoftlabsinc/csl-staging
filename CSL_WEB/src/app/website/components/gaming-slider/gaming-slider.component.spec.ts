import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingSliderComponent } from './gaming-slider.component';

describe('GamingSliderComponent', () => {
  let component: GamingSliderComponent;
  let fixture: ComponentFixture<GamingSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [GamingSliderComponent]
    });
    fixture = TestBed.createComponent(GamingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
