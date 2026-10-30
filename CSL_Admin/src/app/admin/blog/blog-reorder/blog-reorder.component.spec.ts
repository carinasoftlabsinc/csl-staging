import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogReorderComponent } from './blog-reorder.component';

describe('BlogReorderComponent', () => {
  let component: BlogReorderComponent;
  let fixture: ComponentFixture<BlogReorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders({ blogs: [] }),
    });
    fixture = TestBed.createComponent(BlogReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
