import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, input, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

interface MenuLink {
  label: string;
  route: string;
}

interface MenuItem {
  label: string;
  /** Plain link. Leave empty when the item opens a dropdown. */
  route?: string;
  children?: MenuLink[];
  /** Position of the dropdown under its trigger. */
  dropdownClass?: string;
}

/** Below this width the menu is a full-screen overlay and the page behind it must not scroll. */
const OVERLAY_BREAKPOINT = 1024;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  /** Use the dark logo and button on pages with a white background. */
  readonly isWhiteBackground = input(false);

  protected readonly isOpen = signal(false);
  /** Index of the dropdown opened by click or tap. Hover also opens one on desktop. */
  protected readonly openDropdown = signal<number | null>(null);

  protected readonly menu: MenuItem[] = [
    { label: 'Home', route: '/' },
    {
      label: 'Know Us',
      dropdownClass: '-left-9 lg:left-0',
      children: [
        { label: 'Who We Are', route: '/know-us' },
        { label: 'Career', route: '/careers' },
      ],
    },
    {
      label: 'What we do',
      dropdownClass: '-left-10 lg:-left-2',
      children: [
        { label: 'Services', route: '/services' },
        { label: 'Projects', route: '/portfolio' },
      ],
    },
    {
      label: 'Insights',
      dropdownClass: '-left-10 lg:-left-6',
      children: [
        { label: 'Blog', route: '/blog' },
        { label: 'Newsroom', route: '/news-room' },
      ],
    },
    { label: 'Contact Us', route: '/contact-us' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());

    // Never leave the page locked if the header goes away while the menu is open.
    inject(DestroyRef).onDestroy(() => this.setBodyLock(false));
  }

  protected toggle(): void {
    this.openDropdown.set(null);
    this.isOpen.update((open) => !open);
    this.setBodyLock(this.isOpen());
  }

  protected toggleDropdown(index: number): void {
    this.openDropdown.update((current) => (current === index ? null : index));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.openDropdown.set(null);
    }
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (this.viewportWidth() >= OVERLAY_BREAKPOINT) {
      this.setBodyLock(false);
    }
  }

  /** Also used by the links: clicking the page you are already on does not navigate, so the menu would stay open. */
  protected close(): void {
    this.isOpen.set(false);
    this.openDropdown.set(null);
    this.setBodyLock(false);
  }

  private setBodyLock(locked: boolean): void {
    const body = this.doc.body;
    if (!body) return;
    body.style.overflow = locked && this.viewportWidth() < OVERLAY_BREAKPOINT ? 'hidden' : '';
  }

  private viewportWidth(): number {
    return this.doc.defaultView?.innerWidth ?? OVERLAY_BREAKPOINT;
  }
}
