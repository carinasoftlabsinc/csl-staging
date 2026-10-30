import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";

@NgModule({
  declarations: [],
  // TinyMCE 7 mounts its editor dialogs under document.body. Native top-layer
  // overlays would cover them regardless of z-index.
  providers: [{ provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } }],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FeatherIconsModule,
  ],
})
export class SharedModule {}
