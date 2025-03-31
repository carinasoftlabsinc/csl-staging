import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServiceComponent } from './web-service.component';

describe('WebServiceComponent', () => {
  let component: WebServiceComponent;
  let fixture: ComponentFixture<WebServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebServiceComponent]
    });
    fixture = TestBed.createComponent(WebServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
