import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Know2Component } from './know2.component';

describe('Know2Component', () => {
  let component: Know2Component;
  let fixture: ComponentFixture<Know2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Know2Component]
    });
    fixture = TestBed.createComponent(Know2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
