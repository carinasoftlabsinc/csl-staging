import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdsComponent } from './add-ads.component';

describe('AddAdsComponent', () => {
  let component: AddAdsComponent;
  let fixture: ComponentFixture<AddAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders(),
    });
    fixture = TestBed.createComponent(AddAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
