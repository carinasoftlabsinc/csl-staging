import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';

interface FooterLink {
  label: string;
  /** Internal route. Leave empty for an external link. */
  route?: string;
  href?: string;
}

interface FooterIcon {
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tailwind classes that size the image. */
  class: string;
  /** Social icons that sit on a white tile. */
  onWhite?: boolean;
}

interface FooterOffice {
  flag: string;
  alt: string;
  title: string;
  address: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, GradientButtonComponent],
})
export class FooterComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly showCollab = input(true);
  readonly btnText = input('Schedule a call');
  readonly cardText = input('HAVE PROJECT IN MIND ? <br class="hidden sm:block" /> LET’S COLLABORATE.');
  readonly btnLink = input('https://calendar.app.google/mezjQ2cpZyzbixNv6');

  readonly showButton = input(true);
  readonly buttonText = input('GET IN TOUCH');
  readonly showHeading = input(true);
  readonly headingText = input('Let’s create something amazing');

  readonly year = new Date().getFullYear();
  readonly mail = 'business@carinasoftlabs.com';
  readonly phones = [
    { label: '+91 9131958215', tel: '+919131958215' },
    { label: '+1 7866490411', tel: '+17866490411' },
  ];

  /** Floating contact icons fixed to the right edge. */
  readonly dock: FooterIcon[] = [
    { href: 'https://wa.me/919131958215', src: 'assets/color_whatsapp-icon.svg', alt: 'Whatsapp', width: 30, height: 30, class: '' },
    { href: 'https://t.me/CarinaSoftlabsInc', src: 'assets/color_telegram.svg', alt: 'Telegram', width: 30, height: 30, class: '' },
    {
      href: 'https://teams.microsoft.com/l/chat/0/0?users=mayank@carinasoftlabs.com',
      src: 'assets/Teams.svg',
      alt: 'Microsoft Teams',
      width: 30,
      height: 32,
      class: '',
    },
  ];

  readonly navLinks: FooterLink[] = [
    { label: 'Home', route: '/' },
    { label: 'Who we are', route: '/know-us' },
    { label: 'Services', route: '/services' },
    { label: 'Blog', route: '/blog' },
    { label: 'Our success story', href: 'https://www.linkedin.com/company/carinasoftlabsinc/about/' },
    { label: 'Career', href: 'https://www.linkedin.com/company/carinasoftlabsinc/jobs/' },
    { label: 'Contact us', route: '/contact-us' },
  ];

  readonly socials: FooterIcon[] = [
    { href: 'https://www.instagram.com/carinasoftlabs/', src: 'assets/images/insta-black-logo.svg', alt: 'Carina Softlabs on Instagram', width: 30, height: 30, class: 'w-9 h-9' },
    { href: 'https://www.facebook.com/CarinaSoftLabsInc/', src: 'assets/images/facebook-black-logo.svg', alt: 'Carina Softlabs on Facebook', width: 29, height: 30, class: 'w-8 h-8' },
    { href: 'https://in.linkedin.com/company/carinasoftlabsinc', src: 'assets/images/linkedin-black-logo.svg', alt: 'Carina Softlabs on LinkedIn', width: 30, height: 30, class: 'w-9 h-9' },
    { href: 'https://twitter.com/carinasoftlabs', src: 'assets/images/twitter-black-logo.svg', alt: 'Carina Softlabs on X (Twitter)', width: 30, height: 30, class: 'w-9 h-9' },
    { href: 'https://www.artstation.com/carinasoftlabsinc', src: 'assets/images/art-1.webp', alt: 'Carina Softlabs on ArtStation', width: 225, height: 225, class: 'w-8 h-8 bg-white', onWhite: true },
    { href: 'https://www.youtube.com/@CarinaSoftlabs', src: 'assets/images/Youtube-black-logo.svg', alt: 'Carina Softlabs on YouTube', width: 33, height: 32, class: 'w-10 h-10 bg-white', onWhite: true },
  ];

  readonly offices: FooterOffice[] = [
    {
      flag: 'assets/images/usa-flag.svg',
      alt: 'United States flag',
      title: 'USA OFFICE',
      address: '66 W Flagler St Suite 900 – 2034, Miami, FL 33130, United States',
    },
    {
      flag: 'assets/images/india-flag.svg',
      alt: 'India flag',
      title: 'INDIA OFFICE',
      address: '10/2, 2nd Floor, Shree Mahadeo House, near Hotel Surya, South Tukoganj, Indore (M.P.) 452001',
    },
  ];

  /** Review-site logos shown beside each other. */
  readonly reviewSites: FooterIcon[] = [
    { href: 'https://www.upwork.com/agencies/carinasoftlabs/', src: 'assets/images/Upwork.svg', alt: 'Upwork logo', width: 162, height: 84, class: 'lg:w-28 2xl:w-32' },
    { href: 'https://clutch.co/profile/carina-softlabs#highlights', src: 'assets/images/clutch.svg', alt: 'Clutch logo', width: 162, height: 84, class: 'lg:w-28 2xl:w-32' },
  ];

  /** TopDevelopers award badges: one per profile (game/app development and digital marketing). */
  readonly badges: FooterIcon[] = [
    {
      href: 'https://www.topdevelopers.co/directory/mobile-app-development-companies-in-madhya-pradesh',
      src: 'assets/images/topdevelopers-game-badge.webp',
      alt: 'TopDevelopers Top Mobile Game Developers 2021 badge',
      width: 250,
      height: 245,
      class: 'w-20 2xl:w-24 lg:hidden xl:block',
    },
    {
      href: 'https://www.topdevelopers.co/directory/digital-marketing-agencies/miami',
      src: 'assets/images/topdevelopers-digital-badge.webp',
      alt: 'TopDevelopers Top Digital Marketing Companies 2021 badge',
      width: 316,
      height: 311,
      class: 'w-20 2xl:w-24 lg:hidden xl:block',
    },
  ];

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
