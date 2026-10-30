import { NgModule } from '@angular/core';

import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './shared/components/page404/page404.component';
import { ErrorInterceptor } from './error-interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CoreModule } from '@core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({ declarations: [AppComponent, AuthLayoutComponent, Page404Component],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        LoadingBarRouterModule,
        // core & shared
        CoreModule,
        // The root 404 page is the only root-level Material consumer. Importing SharedModule here
        // pulled every Material component into the initial bundle.
        MatButtonModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        // Event replay keeps clicks made before hydration finishes (e.g. on the menu button).
        provideClientHydration(withEventReplay()),
    ] })
export class AppModule {}
