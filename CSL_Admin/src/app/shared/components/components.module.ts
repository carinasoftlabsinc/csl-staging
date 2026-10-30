import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../shared.module";

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent],
})
export class ComponentsModule {}
