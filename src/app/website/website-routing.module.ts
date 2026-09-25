import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteComponent } from './website.component';
import { ServicesComponent } from './services/services.component';
import { KnowComponent } from './know/know.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { Blog2Component } from './blog2/blog2.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { NewsroomComponent } from './newsroom/newsroom.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { Know2Component } from './know2/know2.component';
import { Know3Component } from './know3/know3.component';
import { Know4Component } from './know4/know4.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DigitalServiceComponent } from './digital-service/digital-service.component';
import { WebServiceComponent } from './web-service/web-service.component';
import { GameServiceComponent } from './game-service/game-service.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  // ── Core Canonical Pages ──────────────────────────────────────────
  {
    path: '',
    component: WebsiteComponent,
  },
  {
    path: 'know-us',
    component: KnowComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'web-development',
    component: WebServiceComponent,
  },
  {
    path: 'game-development',
    component: GameServiceComponent,
  },
  {
    path: 'digital-marketing',
    component: DigitalServiceComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'blog/:title',
    component: Blog2Component,
  },
  {
    path: 'contact-us',
    component: ContactComponent,
  },
  {
    path: 'news-room',
    component: NewsroomComponent,
  },
  {
    path: 'news/:id',
    component: NewsDetailComponent,
  },
  {
    path: 'thank-you',
    component: ThankyouComponent,
  },
  {
    path: 'what-you-can-expect',
    component: Know2Component,
  },
  {
    path: 'how-we-work',
    component: Know3Component,
  },
  {
    path: 'careers',
    component: Know4Component,
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
  {
    path: 'portfolio/:id',
    component: CaseStudiesComponent,
  },
  {
    path: 'job-description/:id',
    component: JobDescriptionComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
  },

  // ── Legacy & Short Route Redirects (Preserve SEO & Backlinks) ─────
  { path: 'web', redirectTo: 'web-development', pathMatch: 'full' },
  { path: 'game', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'game2', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'service2', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'web-app-development', redirectTo: 'web-development', pathMatch: 'full' },
  { path: 'about', redirectTo: 'know-us', pathMatch: 'full' },
  { path: 'about-us', redirectTo: 'know-us', pathMatch: 'full' },
  { path: 'know2', redirectTo: 'what-you-can-expect', pathMatch: 'full' },
  { path: 'know3', redirectTo: 'how-we-work', pathMatch: 'full' },
  { path: 'know4', redirectTo: 'careers', pathMatch: 'full' },
  { path: 'blog-details', redirectTo: 'blog', pathMatch: 'full' },
  { path: 'contact', redirectTo: 'contact-us', pathMatch: 'full' },
  { path: 'service-details/digital-marketing', redirectTo: 'digital-marketing', pathMatch: 'full' },
  { path: 'service-details/game-development', redirectTo: 'game-development', pathMatch: 'full' },
  { path: 'service-details/web-development', redirectTo: 'web-development', pathMatch: 'full' },
  { path: 'service-details/mobile-app-development', redirectTo: 'services', pathMatch: 'full' },

  // ── Wildcard 404 Route ───────────────────────────────────────────
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
