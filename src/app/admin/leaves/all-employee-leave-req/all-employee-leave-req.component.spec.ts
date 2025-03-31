import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeLeaveReqComponent } from './all-employee-leave-req.component';

describe('AllEmployeeLeaveReqComponent', () => {
  let component: AllEmployeeLeaveReqComponent;
  let fixture: ComponentFixture<AllEmployeeLeaveReqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEmployeeLeaveReqComponent]
    });
    fixture = TestBed.createComponent(AllEmployeeLeaveReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
