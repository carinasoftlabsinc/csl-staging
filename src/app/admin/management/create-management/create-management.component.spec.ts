import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManagementComponent } from './create-management.component';

describe('CreateManagementComponent', () => {
  let component: CreateManagementComponent;
  let fixture: ComponentFixture<CreateManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateManagementComponent]
    });
    fixture = TestBed.createComponent(CreateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
