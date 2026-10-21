import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

/** 404 page: centred "404", one line of text and one button on the site's dark background. */
@Component({
  selector: 'app-not-found',
  template: `
    <main class="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center px-6 text-center">
      <h1 class="font-mont font-extrabold text-white text-8xl md:text-9xl leading-none">
        404<span class="sr-only"> Page not found</span>
      </h1>
      <p class="mt-6 max-w-md font-quickSand text-[#B4B9CB] text-base md:text-lg leading-relaxed">
        The page you are looking for may have been moved, removed, or is currently unavailable.
      </p>
      <a appGradientButton routerLink="/" class="mt-10">Go to Home Page</a>
    </main>
  `,
  standalone: false,
})
export class NotFoundComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    // HTTP 404 on the server, noindex, and no canonical or social tags.
    this.seoService.setNotFoundPage({
      title: '404 — Page Not Found | Carina Softlabs',
      description: 'The requested page could not be found.',
    });
  }
}
