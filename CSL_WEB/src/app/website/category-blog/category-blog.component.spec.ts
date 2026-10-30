import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBlogComponent } from './category-blog.component';

describe('CategoryBlogComponent', () => {
  let component: CategoryBlogComponent;
  let fixture: ComponentFixture<CategoryBlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    imports: [CategoryBlogComponent]
    });
    fixture = TestBed.createComponent(CategoryBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
