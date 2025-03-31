import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { CreateManagementComponent } from './create-management/create-management.component';
import { GetManagementComponent } from './get-management/get-management.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

const routes: Routes = [
  {
    path: "all-management",
    component: ManagementComponent,
  },
  {
    path: "add-management",
    component: CreateManagementComponent,
  },
  {
    path: "edit-management/:id",
    component: CreateManagementComponent,
  },
  {
    path: "management-profile",
    component: GetManagementComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
