import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllPaySlipComponent } from './get-all-pay-slip.component';

describe('GetAllPaySlipComponent', () => {
  let component: GetAllPaySlipComponent;
  let fixture: ComponentFixture<GetAllPaySlipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllPaySlipComponent]
    });
    fixture = TestBed.createComponent(GetAllPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
