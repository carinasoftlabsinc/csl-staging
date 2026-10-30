import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSliderComponent } from './game-slider.component';

describe('GameSliderComponent', () => {
  let component: GameSliderComponent;
  let fixture: ComponentFixture<GameSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [GameSliderComponent]
    });
    fixture = TestBed.createComponent(GameSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
