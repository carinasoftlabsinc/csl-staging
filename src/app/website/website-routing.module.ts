// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { WebsiteComponent } from './website.component';
// import { AboutComponent } from './about/about.component';
// import { ServicesComponent } from './services/services.component';
// import { KnowComponent } from './know/know.component';
// import { Know2Component } from './know2/know2.component';
// import { Know3Component } from './know3/know3.component';
// import { Know4Component } from './know4/know4.component';
// import { BlogComponent } from './blog/blog.component';
// import { ContactComponent } from './contact/contact.component';
// import { Blog2Component } from './blog2/blog2.component';
// import { Service2Component } from './service2/service2.component';

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: '/',
//     pathMatch: 'full',
//   },
//   {
//     path: '',
//     component: WebsiteComponent,
//   },
//   {
//     path: 'know-us',
//     component: KnowComponent,
//   },
//   // {
//   //   path: 'know2',
//   //   component: Know2Component,
//   // },
//   // {
//   //   path: 'know3',
//   //   component: Know3Component,
//   // },
//   // {
//   //   path: 'know4',
//   //   component: Know4Component,
//   // },
//   // {
//   //   path: 'about',
//   //   component: AboutComponent,
//   // },
//   {
//     path: 'services',
//     component: ServicesComponent,
//   },
//   // {
//   //   path: 'service2',
//   //   component: Service2Component,
//   // },
//   {
//     path: 'blog',
//     component: BlogComponent,
//   },
//   {
//     path: 'blog-details',
//     component: Blog2Component,
//   },
//   {
//     path: 'contact-us',
//     component: ContactComponent,
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class WebsiteRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteComponent } from './website.component';
import { AboutComponent } from './about/about.component';
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
import { Service2Component } from './service2/service2.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';
import { DigitalServiceComponent } from './digital-service/digital-service.component';
import { WebServiceComponent } from './web-service/web-service.component';
import { GameServiceComponent } from './game-service/game-service.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
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
    path: 'game',
    component: Service2Component,
  },
  {
    path: 'game2',
    component: GameServiceComponent,
  },
  {
    path: 'digital-marketing',
    component: DigitalServiceComponent,
  },
  {
    path: 'web',
    component: WebServiceComponent,
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
  // {
  //   path: 'portfolio/:id',
  //   component: PortfolioDetailComponent,
  // },
  {
    path: 'job-description/:id',
    component: JobDescriptionComponent,
  },
  {
    path: 'portfolio/:id',
    component: CaseStudiesComponent,
  },

  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
  },
  // Wildcard route for handling 404 pages
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
