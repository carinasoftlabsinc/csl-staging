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
  type?: 'website' | 'article';
  jsonLd?: object | object[];
}

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
    this.metaSvc.updateTag({ name: 'description', content: config.description });
    this.setCanonical(config.url);
    this.setOg(config);
    if (config.jsonLd) {
      const schemas = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd];
      schemas.forEach((s) => this.injectJsonLd(s));
    }
  }

  /**
   * Sets genuine HTTP 404 response code and Cache-Control headers during SSR.
   */
  setNotFoundStatus(): void {
    if (isPlatformServer(this.platformId) && this.responseInit) {
      this.responseInit.status = 404;
      this.responseInit.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      };
    }
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

  private setOg(config: SeoPageConfig): void {
    this.metaSvc.updateTag({ property: 'og:title', content: config.title });
    this.metaSvc.updateTag({ property: 'og:description', content: config.description });
    this.metaSvc.updateTag({ property: 'og:url', content: config.url });
    this.metaSvc.updateTag({ property: 'og:type', content: config.type || 'website' });
    if (config.image) {
      this.metaSvc.updateTag({ property: 'og:image', content: config.image });
    }
  }

  private injectJsonLd(schema: object): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    this.renderer.setProperty(script, 'textContent', JSON.stringify(schema));
    this.renderer.appendChild(this.doc.head, script);
    this.injectedElements.push(script);
  }
}
