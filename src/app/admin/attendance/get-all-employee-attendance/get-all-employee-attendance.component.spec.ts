import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllEmployeeAttendanceComponent } from './get-all-employee-attendance.component';

describe('GetAllEmployeeAttendanceComponent', () => {
  let component: GetAllEmployeeAttendanceComponent;
  let fixture: ComponentFixture<GetAllEmployeeAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllEmployeeAttendanceComponent]
    });
    fixture = TestBed.createComponent(GetAllEmployeeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
