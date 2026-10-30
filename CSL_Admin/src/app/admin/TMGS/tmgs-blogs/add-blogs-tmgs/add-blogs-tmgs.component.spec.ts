import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlogsTmgsComponent } from './add-blogs-tmgs.component';

describe('AddBlogsTmgsComponent', () => {
  let component: AddBlogsTmgsComponent;
  let fixture: ComponentFixture<AddBlogsTmgsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders(),
    });
    fixture = TestBed.createComponent(AddBlogsTmgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
