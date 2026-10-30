import { MatDialogConfig } from '@angular/material/dialog';

// A 100% width makes CDK left-align the pane even when maxWidth shrinks it.
export const FORM_DIALOG_OPTIONS: MatDialogConfig = {
  width: '1200px',
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: '90vh',
};
