import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Know4Component } from './know4.component';

describe('Know4Component', () => {
  let component: Know4Component;
  let fixture: ComponentFixture<Know4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Know4Component]
    });
    fixture = TestBed.createComponent(Know4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
