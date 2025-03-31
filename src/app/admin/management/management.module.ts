import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { CreateManagementComponent } from './create-management/create-management.component';
import { GetManagementComponent } from './get-management/get-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { Location } from '@angular/common';
@NgModule({
  declarations: [
    ManagementComponent,
    CreateManagementComponent,
    GetManagementComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    ComponentsModule,
    SharedModule
  ],
  providers: [Location],
})
export class ManagementModule { }
