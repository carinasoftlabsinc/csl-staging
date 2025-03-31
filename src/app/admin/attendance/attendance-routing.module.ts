import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodayComponent } from './today/today.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { GetAllEmployeeAttendanceComponent } from './get-all-employee-attendance/get-all-employee-attendance.component';

const routes: Routes = [
  {
    path: 'today',
    component: TodayComponent,
  },
  {
    path: 'all-employee-attendance',
    component: GetAllEmployeeAttendanceComponent,
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
