import {
  Injectable,
  Inject,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RESPONSE_INIT } from '@angular/core';

export interface SeoPageConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  /** Social-share copy when it differs from the <title>/meta description. */
  ogTitle?: string;
  ogDescription?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: object | object[];
}

export const SITE_NAME = 'Carina Softlabs Inc.';
export const DEFAULT_OG_IMAGE = 'https://carinasoftlabs.com/assets/images/og/og-default.png';
const DEFAULT_OG_IMAGE_WIDTH = '1200';
const DEFAULT_OG_IMAGE_HEIGHT = '630';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private renderer: Renderer2;
  private injectedElements: HTMLElement[] = [];
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private titleSvc: Title,
    private metaSvc: Meta,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setPage(config: SeoPageConfig): void {
    this.clearDynamicTags();
    this.titleSvc.setTitle(config.title);
    this.metaSvc.updateTag({ name: 'description', content: this.cleanText(config.description) });
    this.setCanonical(config.url);
    this.setOg(config);
    this.setJsonLd(config.jsonLd);
  }

  /**
   * Replaces the page's JSON-LD. Removes every block previously added through this
   * method — including ones rendered on the server before hydration — so each page
   * carries exactly one copy of its own schema.
   */
  setJsonLd(schema?: object | object[]): void {
    this.doc.head
      .querySelectorAll('script[type="application/ld+json"][data-seo]')
      .forEach((el) => this.renderer.removeChild(this.doc.head, el));

    const schemas = !schema ? [] : Array.isArray(schema) ? schema : [schema];
    schemas.forEach((s) => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      this.renderer.setAttribute(script, 'data-seo', '');
      this.renderer.setProperty(script, 'textContent', JSON.stringify(s));
      this.renderer.appendChild(this.doc.head, script);
    });
    // Only crawlers need the reordering, and they read the server-rendered HTML.
    if (isPlatformServer(this.platformId)) {
      this.moveSeoTagsToTop();
    }
  }

  /**
   * Places SEO tags right after <title>, ahead of the large inlined critical CSS.
   * Link-preview fetchers (WhatsApp, Instagram) read only the start of the HTML,
   * so tags left at the end of <head> are never seen.
   */
  private moveSeoTagsToTop(): void {
    const title = this.doc.head.querySelector('title');
    if (!title) return;
    const selectors = [
      'meta[name="description"]',
      'link[rel="canonical"]',
      'meta[property^="og:"]',
      'meta[property^="article:"]',
      'meta[name^="twitter:"]',
      'script[type="application/ld+json"][data-seo]',
    ];
    let anchor: Element = title;
    selectors.forEach((selector) =>
      this.doc.head.querySelectorAll(selector).forEach((el) => {
        this.renderer.insertBefore(this.doc.head, el, anchor.nextSibling);
        anchor = el;
      }),
    );
  }

  /** For the 404 page: sets the title and description, then marks the page as not found. */
  setNotFoundPage(config: { title: string; description: string }): void {
    this.clearDynamicTags();
    this.titleSvc.setTitle(config.title);
    this.metaSvc.updateTag({ name: 'description', content: this.cleanText(config.description) });
    this.setNotFoundStatus();
  }

  /**
   * Marks the current page as "not found": during SSR the response gets HTTP 404 and no-cache headers,
   * and the page gets `noindex` with no canonical, social (Open Graph / Twitter) or JSON-LD tags,
   * so search engines do not treat a missing address as a real page.
   */
  setNotFoundStatus(): void {
    if (isPlatformServer(this.platformId) && this.responseInit) {
      this.responseInit.status = 404;
      this.responseInit.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      };
    }
    this.metaSvc.updateTag({ name: 'robots', content: 'noindex' });
    this.doc.head
      .querySelectorAll(
        'link[rel="canonical"], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], ' +
          'script[type="application/ld+json"][data-seo]',
      )
      .forEach((el) => this.renderer.removeChild(this.doc.head, el));
    this.injectedElements = this.injectedElements.filter((el) => !!el.parentNode);
  }

  clearDynamicTags(): void {
    this.injectedElements.forEach((el) => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
    this.injectedElements = [];
  }

  private setCanonical(url: string): void {
    const cleanUrl = url.endsWith('/') && url !== 'https://carinasoftlabs.com' ? url.replace(/\/+$/, '') : url;
    const existing = this.doc.querySelector("link[rel='canonical']");
    if (existing) {
      this.renderer.setAttribute(existing, 'href', cleanUrl);
    } else {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.setAttribute(link, 'href', cleanUrl);
      this.renderer.appendChild(this.doc.head, link);
      this.injectedElements.push(link);
    }
  }

  /**
   * Writes the full Open Graph + Twitter Card set on every call so tags from a
   * previously visited route never leak into the next one.
   */
  setOg(config: Omit<SeoPageConfig, 'jsonLd'>): void {
    // Every real page calls this (directly or through setPage), so a noindex left by a 404 page
    // during in-app navigation is removed here.
    this.metaSvc.removeTag("name='robots'");
    const title = config.ogTitle || config.title;
    // Social platforms show ~200 chars; keeps marketing-approved copy intact.
    const description = this.cleanText(config.ogDescription || config.description, 200);
    const image = config.image || DEFAULT_OG_IMAGE;
    const imageAlt = config.imageAlt || title;
    const type = config.type || 'website';

    this.metaSvc.updateTag({ property: 'og:title', content: title });
    this.metaSvc.updateTag({ property: 'og:description', content: description });
    this.metaSvc.updateTag({ property: 'og:url', content: config.url });
    this.metaSvc.updateTag({ property: 'og:type', content: type });
    this.metaSvc.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.metaSvc.updateTag({ property: 'og:locale', content: 'en_US' });
    this.metaSvc.updateTag({ property: 'og:image', content: image });
    this.metaSvc.updateTag({ property: 'og:image:alt', content: imageAlt });

    // Dimensions are only known for the default image; let crawlers measure the rest.
    if (image === DEFAULT_OG_IMAGE) {
      this.metaSvc.updateTag({ property: 'og:image:width', content: DEFAULT_OG_IMAGE_WIDTH });
      this.metaSvc.updateTag({ property: 'og:image:height', content: DEFAULT_OG_IMAGE_HEIGHT });
    } else {
      this.metaSvc.removeTag("property='og:image:width'");
      this.metaSvc.removeTag("property='og:image:height'");
    }

    this.setOrRemove('article:published_time', type === 'article' ? config.publishedTime : undefined);
    this.setOrRemove('article:modified_time', type === 'article' ? config.modifiedTime : undefined);

    this.metaSvc.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaSvc.updateTag({ name: 'twitter:title', content: title });
    this.metaSvc.updateTag({ name: 'twitter:description', content: description });
    this.metaSvc.updateTag({ name: 'twitter:image', content: image });
    this.metaSvc.updateTag({ name: 'twitter:image:alt', content: imageAlt });
  }

  private setOrRemove(property: string, content?: string): void {
    if (content) {
      this.metaSvc.updateTag({ property, content });
    } else {
      this.metaSvc.removeTag(`property='${property}'`);
    }
  }

  /** Strips HTML, collapses whitespace and trims to `max` chars at a word boundary. */
  private cleanText(text: string, max = 160): string {
    const plain = (text || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (plain.length <= max) return plain;
    const cut = plain.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
  }
}
