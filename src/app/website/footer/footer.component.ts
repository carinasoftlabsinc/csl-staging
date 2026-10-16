import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterLinkComponent } from './footer-link.component';
import { CONTACT_DOCK, CONTACT_EMAIL, CONTACT_PHONES, NAV_LINKS, OFFICES, PLATFORMS, SERVICE_LINKS, SOCIALS } from './footer.data';

/**
 * Site footer (Figma "CSL New Web", node 356:6612): call-to-action card, "Let's create" heading, page links,
 * services / offices / contact columns, hiring platforms and the copyright bar. Content lives in footer.data.ts.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet, FooterLinkComponent],
})
export class FooterComponent {
  private readonly platformId = inject(PLATFORM_ID);

  // Call-to-action card above the footer (pages override the text)
  readonly showCollab = input(true);
  readonly cardText = input('HAVE PROJECT IN MIND ? <br class="hidden sm:block" /> LET’S COLLABORATE.');
  readonly btnText = input('Schedule a Call');
  /** Our page (starts with "/") or an external URL. */
  readonly btnLink = input('https://calendar.app.google/mezjQ2cpZyzbixNv6');

  // "Let's create something amazing" row
  readonly showHeading = input(true);
  readonly headingText = input('Let’s create something amazing');
  readonly showButton = input(true);
  readonly buttonText = input('GET IN TOUCH');

  protected readonly isInternalBtnLink = computed(() => this.btnLink().startsWith('/'));

  protected readonly year = new Date().getFullYear();
  protected readonly navLinks = NAV_LINKS;
  protected readonly serviceLinks = SERVICE_LINKS;
  protected readonly offices = OFFICES;
  protected readonly email = CONTACT_EMAIL;
  protected readonly phones = CONTACT_PHONES;
  protected readonly socials = SOCIALS;
  protected readonly platforms = PLATFORMS;
  protected readonly dock = CONTACT_DOCK;

  protected scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
