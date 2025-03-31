import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { EmployeeRoutingModule } from './employee-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendancesComponent } from './attendance/attendance.component';
import { ComponentsModule } from '../shared/components/components.module';
import { MaterialModule, SharedModule } from '@shared';
import { GetAllLeaveRequestComponent } from './get-all-leave-request/get-all-leave-request.component';
import { CreateLeaveRequestComponent } from './create-leave-request/create-leave-request.component';
import { PayrollComponent } from './payroll/payroll.component';

import { EmployeePaySlipComponent } from './employee-pay-slip/employee-pay-slip.component';
@NgModule({
  declarations: [
    DashboardComponent,
    AttendancesComponent,
    GetAllLeaveRequestComponent,
    CreateLeaveRequestComponent,
    PayrollComponent,
    EmployeePaySlipComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    NgChartsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgScrollbarModule,
    NgApexchartsModule,
    DragDropModule,
    ComponentsModule,
    SharedModule,
    MaterialModule
  ],
  providers: [],
})
export class EmployeeModule {}
