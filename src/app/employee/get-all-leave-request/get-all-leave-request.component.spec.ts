import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllLeaveRequestComponent } from './get-all-leave-request.component';

describe('GetAllLeaveRequestComponent', () => {
  let component: GetAllLeaveRequestComponent;
  let fixture: ComponentFixture<GetAllLeaveRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllLeaveRequestComponent]
    });
    fixture = TestBed.createComponent(GetAllLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
