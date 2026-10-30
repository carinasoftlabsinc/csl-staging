import { NgModule } from '@angular/core';
import { WebsiteRoutingModule } from './website-routing.module';

// Every page is a standalone component loaded by its route (see website-routing.module.ts), so a visitor
// downloads only the code for the page they open instead of the whole website.
@NgModule({
  imports: [WebsiteRoutingModule],
})
export class WebsiteModule {}
