import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


// Angular 21+ defaults to zoneless change detection; the admin still relies on zone.js.
platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })
  // eslint-disable-next-line no-console -- the only place to see why the app failed to start
  .catch(err => console.error(err));
