import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeavesRoutingModule } from './leaves-routing.module';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { LeaveBalanceService } from './leave-balance/leave-balance.service';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { AllEmployeeLeaveReqComponent } from './all-employee-leave-req/all-employee-leave-req.component';
import { FormComponent } from './leave-balance/form/form.component';

@NgModule({
  declarations: [
    LeaveBalanceComponent,
    AllEmployeeLeaveReqComponent,
    FormComponent,
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [ LeaveBalanceService],
})
export class LeavesModule {}
