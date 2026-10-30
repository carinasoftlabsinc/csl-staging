import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialBubbleComponent } from './testimonial-bubble.component';

describe('TestimonialBubbleComponent', () => {
  let component: TestimonialBubbleComponent;
  let fixture: ComponentFixture<TestimonialBubbleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [TestimonialBubbleComponent]
    });
    fixture = TestBed.createComponent(TestimonialBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
