import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetManagementComponent } from './get-management.component';

describe('GetManagementComponent', () => {
  let component: GetManagementComponent;
  let fixture: ComponentFixture<GetManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetManagementComponent]
    });
    fixture = TestBed.createComponent(GetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
