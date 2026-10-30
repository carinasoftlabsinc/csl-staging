import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/** Isolate component smoke tests from the backend and dialog host. */
export function componentTestProviders(dialogData: unknown = null) {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideNoopAnimations(),
    { provide: MAT_DIALOG_DATA, useValue: dialogData },
    { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
  ];
}
