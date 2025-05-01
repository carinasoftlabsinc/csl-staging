import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website.component';
import { MaterialModule } from '@shared';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutComponent } from './about/about.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services/services.component';
import { KnowComponent } from './know/know.component';
import { Know2Component } from './know2/know2.component';
import { Know3Component } from './know3/know3.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Know4Component } from './know4/know4.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RacesComponent } from '@shared/components/races/races.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { HoriScrollComponent } from './hori-scroll/hori-scroll.component';
import { StickyBtnComponent } from './sticky-btn/sticky-btn.component';
import { Blog2Component } from './blog2/blog2.component';
import { CategoryBlogComponent } from './category-blog/category-blog.component';
import { BubbleCardComponent } from '@shared/components/bubble-card/bubble-card.component';
import { GetinformComponent } from './components/getinform/getinform.component';
import { ModalFormComponent } from '@shared/components/modal-form/modal-form.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';
import { Service2Component } from './service2/service2.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { NewsroomComponent } from './newsroom/newsroom.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { GameSliderComponent } from './components/game-slider/game-slider.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';
import { ThreeSceneComponent } from './components/three-scene/three-scene.component';
import { DigitalServiceComponent } from './digital-service/digital-service.component';
import { WebServiceComponent } from './web-service/web-service.component';
import { WebSliderComponent } from './components/web-slider/web-slider.component';
import { GameServiceComponent } from './game-service/game-service.component';
import { GamingSliderComponent } from './components/gaming-slider/gaming-slider.component';
import { CoverflowSliderComponent } from './components/coverflow-slider/coverflow-slider.component';
import { JobDescriptionComponent } from './job-description/job-description.component';


@NgModule({
  declarations: [
    WebsiteComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ServicesComponent,
    KnowComponent,
    Know2Component,
    Know3Component,
    Know4Component,
    BlogComponent,
    ContactComponent,
    ToggleSwitchComponent,
    RacesComponent,
    SliderComponent,
    HoriScrollComponent,
    StickyBtnComponent,
    Blog2Component,
    CategoryBlogComponent,
    BubbleCardComponent,
    GetinformComponent,
    ModalFormComponent,
    NotificationComponent,
    Service2Component,
    ThankyouComponent,
    NewsroomComponent,
    NewsDetailComponent,
    GameSliderComponent,
    PortfolioComponent,
    PortfolioDetailComponent,
    ThreeSceneComponent,
    DigitalServiceComponent,
    WebServiceComponent,
    WebSliderComponent,
    GameServiceComponent,
    GamingSliderComponent,
    CoverflowSliderComponent,
    JobDescriptionComponent,
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    CarouselModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WebsiteModule {}
