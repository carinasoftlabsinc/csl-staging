import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetinformComponent } from './getinform.component';

describe('GetinformComponent', () => {
  let component: GetinformComponent;
  let fixture: ComponentFixture<GetinformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetinformComponent]
    });
    fixture = TestBed.createComponent(GetinformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
