import { Component, Input, ChangeDetectionStrategy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FooterComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const Aos = (await import('aos')).default;
      Aos.init({
        disable: 'mobile',
      });
    }
  }

  @Input() showCollab: boolean = true;
  @Input() btnText: string = 'Schedule a call';
  @Input() cardText: string =
    'HAVE PROJECT IN MIND ? <br class="hidden sm:block" /> LET’S COLLABORATE.';
  @Input() btnLink: string = 'https://calendar.app.google/A5eDKdLkRDF9KokT7';

  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'GET IN TOUCH';
  @Input() showHeading: boolean = true;
  @Input() headingText: string = 'Let’s create something amazing';
  mail = ' business@carinasoftlabs.com';

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
