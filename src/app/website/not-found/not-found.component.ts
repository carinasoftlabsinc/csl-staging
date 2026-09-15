import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RESPONSE_INIT } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-not-found',
  template: `
    <section class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white">
      <div class="max-w-md mx-auto">
        <h1 class="text-7xl font-extrabold text-blue-600 mb-4 tracking-tight">404</h1>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p class="text-gray-600 mb-8 text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a
          routerLink="/"
          class="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Return to Homepage
        </a>
      </div>
    </section>
  `,
  standalone: false,
})
export class NotFoundComponent implements OnInit {
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    if (isPlatformServer(this.platformId) && this.responseInit) {
      this.responseInit.status = 404;
      this.responseInit.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      };
    }

    this.seoService.setPage({
      title: '404 — Page Not Found | Carina Softlabs',
      description: 'The requested page could not be found.',
      url: 'https://carinasoftlabs.com/404',
    });
  }
}
