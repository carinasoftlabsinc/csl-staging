import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { Page404Component } from "./page404/page404.component";
import { guestGuard } from "./guest.guard";
const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "signin",
  //   pathMatch: "full",
  // },
  {
    path: "",
    component: SigninComponent,
    canActivate: [guestGuard],
  },
  {
    path: "page404",
    component: Page404Component,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
