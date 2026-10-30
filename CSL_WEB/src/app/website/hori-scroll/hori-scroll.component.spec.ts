import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoriScrollComponent } from './hori-scroll.component';

describe('HoriScrollComponent', () => {
  let component: HoriScrollComponent;
  let fixture: ComponentFixture<HoriScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [HoriScrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoriScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
