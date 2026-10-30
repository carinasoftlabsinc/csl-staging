import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSliderComponent } from './web-slider.component';

describe('WebSliderComponent', () => {
  let component: WebSliderComponent;
  let fixture: ComponentFixture<WebSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [WebSliderComponent]
    });
    fixture = TestBed.createComponent(WebSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
