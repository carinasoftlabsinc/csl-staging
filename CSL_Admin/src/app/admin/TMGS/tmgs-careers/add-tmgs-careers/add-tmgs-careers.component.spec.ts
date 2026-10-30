import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTmgsCareersComponent } from './add-tmgs-careers.component';

describe('AddTmgsCareersComponent', () => {
  let component: AddTmgsCareersComponent;
  let fixture: ComponentFixture<AddTmgsCareersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders(),
    });
    fixture = TestBed.createComponent(AddTmgsCareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
