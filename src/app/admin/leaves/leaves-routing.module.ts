import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LeaveBalanceComponent } from "./leave-balance/leave-balance.component";
import { AllEmployeeLeaveReqComponent } from "./all-employee-leave-req/all-employee-leave-req.component";

const routes: Routes = [
  {
    path: "leave-requests",
    component: AllEmployeeLeaveReqComponent,
  },
  {
    path: "leave-balance",
    component: LeaveBalanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavesRoutingModule {}
