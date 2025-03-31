import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeSalaryComponent } from "./employee-salary/employee-salary.component";
import { PayslipComponent } from "./payslip/payslip.component";
import { GetAllPaySlipComponent } from "./get-all-pay-slip/get-all-pay-slip.component";
import { CreatePaySlipComponent } from "./create-pay-slip/create-pay-slip.component";

const routes: Routes = [
  {
    path: "employee-salary",
    component: EmployeeSalaryComponent,
  },
  {
    path: "pay-slip",
    component: GetAllPaySlipComponent,
  },
  {
    path: "create-paySlip",
    component: CreatePaySlipComponent,
  },
  {
    path: "edit-paySlip/:id",
    component: CreatePaySlipComponent,
  },
  {
    path: "payslip/:id",
    component: PayslipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
