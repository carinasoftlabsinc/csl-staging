import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { newsroomService } from './newsroom.service';
import { environment } from 'environments/environment';



@Component({
  selector: 'app-newsroom',
  templateUrl: './newsroom.component.html',
  styleUrls: ['./newsroom.component.scss'],
})
export class NewsroomComponent implements AfterViewInit {
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;
  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    // Set up Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - add autoplay to the src
            this.videoIframe.nativeElement.src =
              'https://www.youtube.com/embed/J2vM81MHUa0?si=lO0Fo_F9VsVfGCnz&autoplay=1&mute=0';
          } else {
            // Remove autoplay when video is out of view (optional)
            this.videoIframe.nativeElement.src =
              'https://www.youtube.com/embed/J2vM81MHUa0?si=lO0Fo_F9VsVfGCnz';
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold based on when you want it to start
    );

    // Start observing the video element
    if (this.videoIframe) {
      this.observer.observe(this.videoIframe.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Disconnect observer when component is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // formatHeading(heading: string): string {
  //   return heading.toLocaleLowerCase().replace(/ /g, '-');
  // }

  featured: any[] = [];
  allNews: any[] = [];
  prevFeatured: any[] = [];

  constructor(private newsroomService: newsroomService) {}

  imageUrl = environment.imageBaseUrl;

  ngOnInit(): void {
    this.fetchFeaturedItems();
    this.fetchAllNews();
    this.fetchPreFeaturedItems();
  }

  featuredLoading = true;
prevFeaturedLoading = true;
allNewsLoading = true;


  // fetchFeaturedItems(): void {
  //   this.newsroomService.getFeaturedItems().subscribe({
  //     next: (data) => {
  //       this.featured = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching featured news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  // fetchPreFeaturedItems(): void {
  //   this.newsroomService.getPreFeaturedItems().subscribe({
  //     next: (data) => {
  //       this.prevFeatured = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching featured news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  // fetchAllNews(): void {
  //   this.newsroomService.getAllNews().subscribe({
  //     next: (data) => {
  //       this.allNews = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching all news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  fetchFeaturedItems(): void {
  this.featuredLoading = true;
  this.newsroomService.getFeaturedItems().subscribe({
    next: (data) => {
      this.featured = data.data.data;
    },
    error: (error) => {
      console.error('Error fetching featured news:', error);
    },
    complete: () => {
      this.featuredLoading = false;
    },
  });
}

fetchPreFeaturedItems(): void {
  this.prevFeaturedLoading = true;
  this.newsroomService.getPreFeaturedItems().subscribe({
    next: (data) => {
      this.prevFeatured = data.data.data;
    },
    error: (error) => {
      console.error('Error fetching featured news:', error);
    },
    complete: () => {
      this.prevFeaturedLoading = false;
    },
  });
}

fetchAllNews(): void {
  this.allNewsLoading = true;
  this.newsroomService.getAllNews().subscribe({
    next: (data) => {
      this.allNews = data.data.data;
    },
    error: (error) => {
      console.error('Error fetching all news:', error);
    },
    complete: () => {
      this.allNewsLoading = false;
    },
  });
}


  formatHeading(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;

  

}
