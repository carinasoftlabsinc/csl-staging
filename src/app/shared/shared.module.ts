import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";
import { CheckinTimePipe } from "app/employee/pipe";
@NgModule({
  declarations: [CheckinTimePipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FeatherIconsModule,
    CheckinTimePipe
  ],
})
export class SharedModule {}
