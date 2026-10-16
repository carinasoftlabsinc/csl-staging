/**
 * Footer content (Figma "CSL New Web", node 356:6612). Edit links, offices and logos here; the template only renders them.
 */

/** An internal page (`route`) or an external site (`href`, opens in a new tab). */
export type FooterLink = { readonly label: string } & ({ readonly route: string } | { readonly href: string });

export interface FooterImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/** An image that links to an external profile (socials, hiring platforms, contact dock). */
export interface FooterImageLink extends FooterImage {
  readonly href: string;
}

export interface FooterOffice {
  readonly title: string;
  readonly address: string;
  readonly flag: FooterImage;
}

export interface FooterPhone {
  readonly label: string;
  readonly tel: string;
}

export const NAV_LINKS: readonly FooterLink[] = [
  { label: 'Home', route: '/' },
  { label: 'About Us', route: '/know-us' },
  { label: 'Portfolio', route: '/portfolio' },
  { label: 'Case Studies', route: '/portfolio' },
  { label: 'Blog', route: '/blog' },
  { label: 'Careers', route: '/careers' },
  { label: 'Contact Us', route: '/contact-us' },
];

/** Services without their own page link to /services. */
export const SERVICE_LINKS: readonly FooterLink[] = [
  { label: 'Game Development', route: '/game-development' },
  { label: 'Web Development', route: '/web-development' },
  { label: 'Mobile App Development', route: '/app-development' },
  { label: 'Digital Marketing', route: '/digital-marketing' },
  { label: 'AI Automation', route: '/services' },
  { label: 'AR/VR Development', route: '/services' },
  { label: 'UI/UX Design', route: '/services' },
];

export const OFFICES: readonly FooterOffice[] = [
  {
    title: 'INDIA OFFICE',
    address: '10/2, 2nd Floor, Shree Mahadeo House, Near Hotel Surya, South Tukoganj, Indore (M.P.) 452001',
    flag: { src: 'assets/images/india-flag.svg', alt: 'India flag', width: 30, height: 30 },
  },
  {
    title: 'USA OFFICE',
    address: '66 W Flagler St, Suite 900-2034, Miami, FL 33130, United States',
    flag: { src: 'assets/images/usa-flag.svg', alt: 'United States flag', width: 30, height: 30 },
  },
];

export const CONTACT_EMAIL = 'business@carinasoftlabs.com';

export const CONTACT_PHONES: readonly FooterPhone[] = [
  { label: '+91 9131958215', tel: '+919131958215' },
  { label: '+1 7866490411', tel: '+17866490411' },
];

export const SOCIALS: readonly FooterImageLink[] = [
  { href: 'https://www.instagram.com/carinasoftlabs/', src: 'assets/images/footer/instagram.svg', alt: 'Carina Softlabs on Instagram', width: 45, height: 45 },
  { href: 'https://www.facebook.com/CarinaSoftLabsInc/', src: 'assets/images/footer/facebook.svg', alt: 'Carina Softlabs on Facebook', width: 45, height: 45 },
  { href: 'https://in.linkedin.com/company/carinasoftlabsinc', src: 'assets/images/footer/linkedin.svg', alt: 'Carina Softlabs on LinkedIn', width: 40, height: 40 },
  { href: 'https://twitter.com/carinasoftlabs', src: 'assets/images/footer/x.svg', alt: 'Carina Softlabs on X (Twitter)', width: 40, height: 40 },
  { href: 'https://www.youtube.com/@CarinaSoftlabs', src: 'assets/images/footer/youtube.svg', alt: 'Carina Softlabs on YouTube', width: 40, height: 40 },
  { href: 'https://www.artstation.com/carinasoftlabsinc', src: 'assets/images/footer/artstation.svg', alt: 'Carina Softlabs on ArtStation', width: 40, height: 40 },
];

/** A hiring platform. Without `logo` its name is shown as text; without `href` it is not a link. */
export interface FooterPlatform {
  readonly name: string;
  readonly href?: string;
  readonly logo?: FooterImage;
  /** The logo image has no built-in padding (unlike the Upwork/Clutch SVGs), so it is shown smaller. */
  readonly tight?: boolean;
}

/**
 * "Hire Us On Trusted Platforms".
 * TODO: Freelancer profile URL.
 */
export const PLATFORMS: readonly FooterPlatform[] = [
  {
    name: 'Upwork',
    href: 'https://www.upwork.com/agencies/carinasoftlabs/',
    logo: { src: 'assets/images/Upwork.svg', alt: 'Carina Softlabs on Upwork', width: 162, height: 84 },
  },
  {
    name: 'Freelancer',
    logo: { src: 'assets/images/freelancer.webp', alt: 'Carina Softlabs on Freelancer', width: 512, height: 157 },
    tight: true,
  },
  {
    name: 'Clutch',
    href: 'https://clutch.co/profile/carina-softlabs#highlights',
    logo: { src: 'assets/images/clutch.svg', alt: 'Carina Softlabs on Clutch', width: 162, height: 84 },
  },
];

/** Floating contact icons fixed to the right edge of the screen. */
export const CONTACT_DOCK: readonly FooterImageLink[] = [
  { href: 'https://wa.me/919131958215', src: 'assets/color_whatsapp-icon.svg', alt: 'Chat on WhatsApp', width: 30, height: 30 },
  { href: 'https://t.me/CarinaSoftlabsInc', src: 'assets/color_telegram.svg', alt: 'Chat on Telegram', width: 30, height: 30 },
  { href: 'https://teams.microsoft.com/l/chat/0/0?users=mayank@carinasoftlabs.com', src: 'assets/Teams.svg', alt: 'Chat on Microsoft Teams', width: 30, height: 32 },
];
