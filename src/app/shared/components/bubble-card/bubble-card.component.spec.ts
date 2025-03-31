import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleCardComponent } from './bubble-card.component';

describe('BubbleCardComponent', () => {
  let component: BubbleCardComponent;
  let fixture: ComponentFixture<BubbleCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BubbleCardComponent]
    });
    fixture = TestBed.createComponent(BubbleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
