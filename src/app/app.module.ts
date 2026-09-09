import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './shared/components/page404/page404.component';
import { ErrorInterceptor } from './error-interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';

@NgModule({ declarations: [AppComponent, AuthLayoutComponent, Page404Component],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        LoadingBarRouterModule,
        // core & shared
        CoreModule,
        SharedModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
