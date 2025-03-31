import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { PayrollRoutingModule } from './payroll-routing.module';
import { EmployeeSalaryComponent } from './employee-salary/employee-salary.component';
import { PayslipComponent } from './payslip/payslip.component';
import { DeleteDialogComponent } from './employee-salary/dialogs/delete/delete.component';
import { FormDialogComponent } from './employee-salary/dialogs/form-dialog/form-dialog.component';
import { EmployeeSalaryService } from './employee-salary/employee-salary.service';
import { GetAllPaySlipComponent } from './get-all-pay-slip/get-all-pay-slip.component';
import { CreatePaySlipComponent } from './create-pay-slip/create-pay-slip.component';

@NgModule({
  declarations: [
    EmployeeSalaryComponent,
    PayslipComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    GetAllPaySlipComponent,
    CreatePaySlipComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
  providers: [EmployeeSalaryService],
})
export class PayrollModule {}
