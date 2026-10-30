import { blogPostResolver, moreBlogsResolver } from './blog2/blog-post.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ── Core Canonical Pages ──────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./website.component').then((m) => m.WebsiteComponent),
  },
  {
    path: 'know-us',
    loadComponent: () => import('./know/know.component').then((m) => m.KnowComponent),
  },
  {
    path: 'services',
    loadComponent: () => import('./services/services.component').then((m) => m.ServicesComponent),
  },
  {
    path: 'web-development',
    loadComponent: () => import('./web-service/web-service.component').then((m) => m.WebServiceComponent),
  },
  {
    path: 'game-development',
    loadComponent: () => import('./game-service/game-service.component').then((m) => m.GameServiceComponent),
  },
  {
    path: 'digital-marketing',
    loadComponent: () => import('./digital-service/digital-service.component').then((m) => m.DigitalServiceComponent),
  },
  { path: 'app-development', loadComponent: () => import('./app-service/app-service.component').then((m) => m.AppServiceComponent) },
  { path: 'ai-emerging-technology', loadComponent: () => import('./ai-service/ai-service.component').then((m) => m.AiServiceComponent) },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'blog/:title',
    loadComponent: () => import('./blog2/blog2.component').then((m) => m.Blog2Component),
    resolve: { post: blogPostResolver, moreBlogs: moreBlogsResolver },
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'news-room',
    loadComponent: () => import('./newsroom/newsroom.component').then((m) => m.NewsroomComponent),
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./news-detail/news-detail.component').then((m) => m.NewsDetailComponent),
  },
  {
    path: 'thank-you',
    loadComponent: () => import('./thankyou/thankyou.component').then((m) => m.ThankyouComponent),
  },
  // Not live yet: the pages still have placeholder content. Uncomment (and restore the entries in
  // app.routes.server.ts, scripts/generate-sitemap.ts and the know2/know3 redirects below) to publish them.
  // {
  //   path: 'what-you-can-expect',
  //   loadComponent: () => import('./know2/know2.component').then((m) => m.Know2Component),
  // },
  // {
  //   path: 'how-we-work',
  //   loadComponent: () => import('./know3/know3.component').then((m) => m.Know3Component),
  // },
  {
    path: 'careers',
    loadComponent: () => import('./know4/know4.component').then((m) => m.Know4Component),
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./portfolio/portfolio.component').then((m) => m.PortfolioComponent),
  },
  {
    path: 'portfolio/:id',
    loadComponent: () => import('./case-studies/case-studies.component').then((m) => m.CaseStudiesComponent),
  },
  {
    path: 'job-description/:id',
    loadComponent: () => import('./job-description/job-description.component').then((m) => m.JobDescriptionComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./terms-conditions/terms-conditions.component').then((m) => m.TermsConditionsComponent),
  },

  // ── Legacy & Short Route Redirects (Preserve SEO & Backlinks) ─────
  { path: 'web', redirectTo: 'services', pathMatch: 'full' },
  { path: 'game', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'game2', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'service2', redirectTo: 'services', pathMatch: 'full' },
  { path: 'web-app-development', redirectTo: 'services', pathMatch: 'full' },
  { path: 'about', redirectTo: 'know-us', pathMatch: 'full' },
  { path: 'about-us', redirectTo: 'know-us', pathMatch: 'full' },
  // { path: 'know2', redirectTo: 'what-you-can-expect', pathMatch: 'full' },
  // { path: 'know3', redirectTo: 'how-we-work', pathMatch: 'full' },
  { path: 'know4', redirectTo: 'careers', pathMatch: 'full' },
  { path: 'blog-details', redirectTo: 'blog', pathMatch: 'full' },
  { path: 'contact', redirectTo: 'contact-us', pathMatch: 'full' },
  { path: 'service-details/digital-marketing', redirectTo: 'digital-marketing', pathMatch: 'full' },
  { path: 'service-details/game-development', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'service-details/web-development', redirectTo: 'web-development', pathMatch: 'full' },
  { path: 'service-details/mobile-app-development', redirectTo: 'app-development', pathMatch: 'full' },
  { path: 'mobile-app-development', redirectTo: 'app-development', pathMatch: 'full' },
  { path: 'mobile-service', redirectTo: 'app-development', pathMatch: 'full' },

  // ── Wildcard 404 Route ───────────────────────────────────────────
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
