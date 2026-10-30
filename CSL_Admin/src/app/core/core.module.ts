import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightSidebarService } from './service/rightsidebar.service';
import { DirectionService } from './service/direction.service';

@NgModule({
  imports: [CommonModule],
  providers: [RightSidebarService, DirectionService],
})
export class CoreModule {}
