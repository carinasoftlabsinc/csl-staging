import { Direction } from '@angular/cdk/bidi';
import { Component, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DirectionService, InConfiguration } from '@core';
import { ConfigService } from '@config';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AuthLayoutComponent {
  direction: Direction = 'ltr';
  public config!: InConfiguration;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private directoryService: DirectionService,
    private configService: ConfigService,
    private renderer: Renderer2
  ) {
    this.config = this.configService.configData;
    const isBrowser = isPlatformBrowser(this.platformId);

    this.directoryService.currentData.subscribe((currentData) => {
      if (currentData) {
        this.direction = currentData === 'ltr' ? 'ltr' : 'rtl';
      } else if (isBrowser) {
        if (localStorage.getItem('isRtl')) {
          if (localStorage.getItem('isRtl') === 'true') {
            this.direction = 'rtl';
          } else if (localStorage.getItem('isRtl') === 'false') {
            this.direction = 'ltr';
          }
        } else {
          if (this.config) {
            if (this.config.layout.rtl === true) {
              this.direction = 'rtl';
              localStorage.setItem('isRtl', 'true');
            } else {
              this.direction = 'ltr';
              localStorage.setItem('isRtl', 'false');
            }
          }
        }
      }
    });

    // set theme on startup
    if (isBrowser && localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('theme') as string
      );
    } else if (this.config?.layout?.variant) {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }
  }
}
