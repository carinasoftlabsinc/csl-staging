import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [AppModule],
  // Blog detail responses currently reach about 9.8 MB because article sections
  // contain embedded media. Allow those responses to finish during SSR.
  providers: [
    provideServerRendering(
      { maxResponseBodySize: 12 * 1024 * 1024 },
      withRoutes(serverRoutes),
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
