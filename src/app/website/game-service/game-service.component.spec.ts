import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameServiceComponent } from './game-service.component';

describe('GameServiceComponent', () => {
  let component: GameServiceComponent;
  let fixture: ComponentFixture<GameServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameServiceComponent]
    });
    fixture = TestBed.createComponent(GameServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
