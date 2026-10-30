import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { BlogComponent } from './blog/blog.component';
import { BlogDetialsComponent } from './blog/blog-detials/blog-detials.component';
import { SharedModule } from "@shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from "@shared/components/components.module";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './news/add-news/add-news.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { AddProjectDetailsComponent } from "./project-details/add-project-details/add-project-details.component";
import { TmgsHomeComponent } from './TMGS/tmgs-home/tmgs-home.component';
import { AddGamesComponent } from './TMGS/tmgs-home/add-games/add-games/add-games.component';
import { TmgsWebHomeComponent } from './TMGS/tmgs-web-home/tmgs-web-home.component';
import { AddHomeComponent } from './TMGS/tmgs-web-home/add-home/add-home.component';
import { TmgsBlogsComponent } from './TMGS/tmgs-blogs/tmgs-blogs.component';
import { AddBlogsTmgsComponent } from './TMGS/tmgs-blogs/add-blogs-tmgs/add-blogs-tmgs.component';
import { TmgsCareersComponent } from "./TMGS/tmgs-careers/tmgs-careers.component";
import { AddTmgsCareersComponent } from "./TMGS/tmgs-careers/add-tmgs-careers/add-tmgs-careers.component";
import { TmgsContactComponent } from "./TMGS/tmgs-contact/tmgs-contact.component";
import { AdsComponent } from "./TMGS/ads/ads.component";
import { AddAdsComponent } from "./TMGS/ads/add-ads/add-ads.component";
import { TmgsJobApplicationComponent } from "./TMGS/tmgs-job-application/tmgs-job-application.component";
import { TmgsTeamComponent } from './TMGS/tmgs-team/tmgs-team.component';
import { AddTeamMemberComponent } from './TMGS/tmgs-team/add-team-member/add-team-member.component';
import { TmgsPartnersComponent } from './TMGS/tmgs-partners/tmgs-partners.component';
import { AddTmgsPartnerComponent } from './TMGS/tmgs-partners/add-tmgs-partner/add-tmgs-partner.component';
import { PrivacyTermsComponent } from './TMGS/privacy-terms/privacy-terms.component';
import { TmgsCategoryComponent } from "./TMGS/tmgs-category/tmgs-category.component";
import { AddCategoryComponent } from "./TMGS/tmgs-category/add-category/add-category.component";
import { ImageUploadComponent } from './TMGS/image-upload/image-upload.component';
import { AddImageUploadComponent } from "./TMGS/image-upload/add-image-upload/add-image-upload.component";
import { CareersComponent } from './careers/careers.component';
import { AddCareersComponent } from './careers/add-careers/add-careers.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { GameOrderDialogComponent } from "./TMGS/tmgs-home/game-order-dialog/game-order-dialog.component";
import { TmgsBlogOrderComponent } from "./TMGS/tmgs-blogs/tmgs-blog-order/tmgs-blog-order.component";
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlogReorderComponent } from './blog/blog-reorder/blog-reorder.component';
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DashboardTmgsComponent } from "./TMGS/dashboard-tmgs/dashboard-tmgs.component";
import { BlogEditorComponent } from "./blog/blog-editor/blog-editor.component";
import { ImageUploadFieldComponent } from "./components/image-upload-field/image-upload-field.component";





@NgModule({
  declarations: [
    BlogComponent,
    BlogDetialsComponent,
    NewsComponent,
    AddNewsComponent,
    ContactDetailsComponent,
    ProjectDetailsComponent,
    AddProjectDetailsComponent,
    TmgsHomeComponent,
    AddGamesComponent,
    TmgsWebHomeComponent,
    AddHomeComponent,
    TmgsBlogsComponent,
    AddBlogsTmgsComponent,
    TmgsCareersComponent,
    AddTmgsCareersComponent,
    TmgsContactComponent,
    AdsComponent,
    AddAdsComponent,
    TmgsJobApplicationComponent,
    TmgsTeamComponent,
    AddTeamMemberComponent,
    TmgsPartnersComponent,
    AddTmgsPartnerComponent,
    PrivacyTermsComponent,
    TmgsCategoryComponent,
    AddCategoryComponent,
    ImageUploadComponent,
    AddImageUploadComponent,
    CareersComponent,
    AddCareersComponent,
    JobApplicationsComponent,
    GameOrderDialogComponent,
    TmgsBlogOrderComponent,
    BlogReorderComponent,
    DashboardTmgsComponent,
    BlogEditorComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    NgScrollbarModule,
    NgApexchartsModule,
    
    AngularEditorModule,
    DragDropModule,
    ComponentsModule,
    SharedModule,
    EditorModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    ImageUploadFieldComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {}
