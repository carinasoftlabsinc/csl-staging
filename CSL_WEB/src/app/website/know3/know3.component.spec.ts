import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Know3Component } from './know3.component';

describe('Know3Component', () => {
  let component: Know3Component;
  let fixture: ComponentFixture<Know3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [Know3Component]
    });
    fixture = TestBed.createComponent(Know3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
