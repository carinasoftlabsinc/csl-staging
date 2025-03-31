import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalServiceComponent } from './digital-service.component';

describe('DigitalServiceComponent', () => {
  let component: DigitalServiceComponent;
  let fixture: ComponentFixture<DigitalServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalServiceComponent]
    });
    fixture = TestBed.createComponent(DigitalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
