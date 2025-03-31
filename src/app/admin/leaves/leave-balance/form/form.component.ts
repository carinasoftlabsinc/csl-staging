// FormComponent.ts

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  leavesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    // Initialize the form with the provided data or default values
    this.leavesForm = this.formBuilder.group({
      casualLeave: [data ? data.casualLeave : 0, Validators.required],
      personalLeave: [data ? data.personalLeave : 0, Validators.required],
      medicalLeave: [data ? data.medicalLeave : 0, Validators.required],
      maternityLeave: [data ? data.maternityLeave : 0, Validators.required],
      LWP: [data ? data.LWP : 0, Validators.required]
    });
  }

  confirmAdd(): void {
    if (this.leavesForm.valid) {
      // Form is valid, update the data and close the dialog
      const updatedData = this.leavesForm.value;
      this.dialogRef.close(updatedData);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
