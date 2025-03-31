import { Page404Component } from '../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendancesComponent } from './attendance/attendance.component';
import { GetAllLeaveRequestComponent } from './get-all-leave-request/get-all-leave-request.component';
import { CreateLeaveRequestComponent } from './create-leave-request/create-leave-request.component';
import { PayrollComponent} from './payroll/payroll.component';
import { EmployeePaySlipComponent } from './employee-pay-slip/employee-pay-slip.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'attendance',
    component: AttendancesComponent,
  },
  {
    path: 'LeaveRequest',
    component: GetAllLeaveRequestComponent,
  },
  {
    path: 'createRequest',
    component: CreateLeaveRequestComponent,
  },
  {
    path: 'editRequest/:id',
    component: CreateLeaveRequestComponent,
  },
  {
    path: 'employeePaySlip',
    component: PayrollComponent,
  },
  {
    path: 'payslip/:id',
    component: EmployeePaySlipComponent,
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
