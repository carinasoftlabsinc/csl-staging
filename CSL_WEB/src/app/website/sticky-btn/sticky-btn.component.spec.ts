import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyBtnComponent } from './sticky-btn.component';

describe('StickyBtnComponent', () => {
  let component: StickyBtnComponent;
  let fixture: ComponentFixture<StickyBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [StickyBtnComponent]
    });
    fixture = TestBed.createComponent(StickyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
