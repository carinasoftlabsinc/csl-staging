import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgsPartnersComponent } from './tmgs-partners.component';

describe('TmgsPartnersComponent', () => {
  let component: TmgsPartnersComponent;
  let fixture: ComponentFixture<TmgsPartnersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders(),
    });
    fixture = TestBed.createComponent(TmgsPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
