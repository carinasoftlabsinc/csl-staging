import { UntypedFormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/service/analytics.service';
import { ContactService } from 'app/website/contact/contact.service';
import { GetinformComponent } from './getinform.component';

describe('GetinformComponent', () => {
  let component: GetinformComponent;
  let contact: jasmine.SpyObj<ContactService>;
  let analytics: jasmine.SpyObj<AnalyticsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    contact = jasmine.createSpyObj<ContactService>('ContactService', ['Add']);
    analytics = jasmine.createSpyObj<AnalyticsService>('AnalyticsService', ['trackGenerateLead']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    snackBar.open.and.returnValue({ afterDismissed: () => of(undefined) } as any);

    component = new GetinformComponent(
      new UntypedFormBuilder(),
      contact,
      snackBar,
      router,
      analytics
    );
  });

  it('does not submit or track an invalid form', () => {
    component.onSave();

    expect(contact.Add).not.toHaveBeenCalled();
    expect(analytics.trackGenerateLead).not.toHaveBeenCalled();
  });

  it('preselects the service and keeps budget optional', () => {
    component.servicePreset = 'Game Development';
    component.ngOnInit();
    component.getinformForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9999999999',
      termsAccepted: true,
    });

    expect(component.getinformForm.value.service).toBe('Game Development');
    expect(component.getinformForm.valid).toBeTrue();
  });

  it('requires a numeric phone number with 10 to 15 digits', () => {
    const phone = component.getinformForm.get('phone')!;

    for (const invalid of ['123456789', '1234567890123456', '+19999999999', '555-123-4567']) {
      phone.setValue(invalid);
      expect(phone.invalid).toBeTrue();
    }
    phone.setValue('1234567890');
    expect(phone.valid).toBeTrue();
  });

  it('sends all lead fields and tracks GA4 after backend success', () => {
    component.servicePreset = 'Web Development';
    component.ngOnInit();
    component.getinformForm.setValue({
      name: '  Test User  ',
      email: '  test@example.com  ',
      phone: '1234567890',
      service: 'Web Development',
      budget: '$5,000 – $15,000',
      message: '  Build a site  ',
      termsAccepted: true,
    });
    contact.Add.and.returnValue(of({ status: 'success', message: 'Saved', data: {} } as any));

    component.onSave();

    expect(contact.Add).toHaveBeenCalledOnceWith(
      'Test User',
      'test@example.com',
      '1234567890',
      'Build a site',
      '',
      '$5,000 – $15,000',
      'Web Development'
    );
    expect(analytics.trackGenerateLead).toHaveBeenCalledOnceWith({
      formName: 'Lead Capture Form — Web Development',
      category: 'lead_generation',
    });
    expect(router.navigate).toHaveBeenCalledOnceWith(['/thank-you']);
  });

  it('does not track GA4 when the backend rejects the lead', () => {
    spyOn(console, 'error');
    component.getinformForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9999999999',
      service: 'Game Development',
      budget: '500',
      message: '',
      termsAccepted: true,
    });
    contact.Add.and.returnValue(throwError(() => new Error('Submission failed')));

    component.onSave();

    expect(analytics.trackGenerateLead).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not track GA4 when the backend returns an unsuccessful response', () => {
    component.getinformForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9999999999',
      service: 'Web Development',
      budget: '500',
      message: '',
      termsAccepted: true,
    });
    contact.Add.and.returnValue(of({ status: 'error', message: 'Rejected', data: null }));

    component.onSave();

    expect(analytics.trackGenerateLead).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
