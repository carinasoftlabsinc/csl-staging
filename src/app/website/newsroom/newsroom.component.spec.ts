import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsroomComponent } from './newsroom.component';

describe('NewsroomComponent', () => {
  let component: NewsroomComponent;
  let fixture: ComponentFixture<NewsroomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsroomComponent]
    });
    fixture = TestBed.createComponent(NewsroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
