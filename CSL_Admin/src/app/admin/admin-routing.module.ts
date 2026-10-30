import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { BlogDetialsComponent } from './blog/blog-detials/blog-detials.component';
import { BlogEditorComponent, blogEditorLeaveGuard } from './blog/blog-editor/blog-editor.component';
import { NewsComponent } from './news/news.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TmgsHomeComponent } from './TMGS/tmgs-home/tmgs-home.component';
import { TmgsWebHomeComponent } from './TMGS/tmgs-web-home/tmgs-web-home.component';
import { TmgsBlogsComponent } from './TMGS/tmgs-blogs/tmgs-blogs.component';
import { TmgsCareersComponent } from './TMGS/tmgs-careers/tmgs-careers.component';
import { TmgsContactComponent } from './TMGS/tmgs-contact/tmgs-contact.component';
import { AdsComponent } from './TMGS/ads/ads.component';
import { TmgsJobApplicationComponent } from './TMGS/tmgs-job-application/tmgs-job-application.component';
import { TmgsTeamComponent } from './TMGS/tmgs-team/tmgs-team.component';
import { TmgsPartnersComponent } from './TMGS/tmgs-partners/tmgs-partners.component';
import { PrivacyTermsComponent } from './TMGS/privacy-terms/privacy-terms.component';
import { TmgsCategoryComponent } from './TMGS/tmgs-category/tmgs-category.component';
import { ImageUploadComponent } from './TMGS/image-upload/image-upload.component';
import { CareersComponent } from './careers/careers.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { DashboardTmgsComponent } from './TMGS/dashboard-tmgs/dashboard-tmgs.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path:"blogs",
    component: BlogComponent
  },
  {
    path: 'blogs/new',
    component: BlogEditorComponent,
    canDeactivate: [blogEditorLeaveGuard],
  },
  {
    path: 'blogs/:id/edit',
    component: BlogEditorComponent,
    canDeactivate: [blogEditorLeaveGuard],
  },
  {
    path:"blog_details/:id",
    component: BlogDetialsComponent
  },
  {
    path:"news_room",
    component: NewsComponent
  },
  {
    path:"contact_details",
    component: ContactDetailsComponent
  },
  {
    path:"project_details",
    component: ProjectDetailsComponent
  },
  {
    path:"careers",
    component: CareersComponent
  },
  {
    path:"job_application",
    component: JobApplicationsComponent
  },
  {
    path:"tmgs_games",
    component: TmgsHomeComponent
  },
  {
    path:"tmgs_home",
    component: TmgsWebHomeComponent
  },
  {
    path:"tmgs_blogs",
    component: TmgsBlogsComponent
  },
  {
    path:"tmgs_careers",
    component: TmgsCareersComponent
  },
  {
    path:"tmgs_contacts",
    component: TmgsContactComponent
  },
  {
    path:"tmgs_ads",
    component: AdsComponent
  },
  {
    path:"tmgs_job_application",
    component: TmgsJobApplicationComponent
  },
  {
    path:"tmgs_team",
    component: TmgsTeamComponent
  },
  {
    path:"tmgs_partners",
    component: TmgsPartnersComponent
  },
  {
    path:"tmgs_terms-privacy",
    component: PrivacyTermsComponent
  },
  {
    path:"tmgs_category",
    component: TmgsCategoryComponent
  },
  {
    path:"tmgs_image_upload",
    component: ImageUploadComponent
  },
  {
    path:"tmgs_dashboard",
    component: DashboardTmgsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
