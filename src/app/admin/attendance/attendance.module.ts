import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { TodayComponent } from './today/today.component';
import { GetAllEmployeeAttendanceComponent } from './get-all-employee-attendance/get-all-employee-attendance.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
@NgModule({
  declarations: [TodayComponent, GetAllEmployeeAttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [],
})
export class AttendanceModule {}
