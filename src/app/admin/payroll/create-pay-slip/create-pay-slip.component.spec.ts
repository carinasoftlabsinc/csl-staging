import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaySlipComponent } from './create-pay-slip.component';

describe('CreatePaySlipComponent', () => {
  let component: CreatePaySlipComponent;
  let fixture: ComponentFixture<CreatePaySlipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePaySlipComponent]
    });
    fixture = TestBed.createComponent(CreatePaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
