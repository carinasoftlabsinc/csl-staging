import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgsBlogOrderComponent } from './tmgs-blog-order.component';

describe('TmgsBlogOrderComponent', () => {
  let component: TmgsBlogOrderComponent;
  let fixture: ComponentFixture<TmgsBlogOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders({ blogs: [] }),
    });
    fixture = TestBed.createComponent(TmgsBlogOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
