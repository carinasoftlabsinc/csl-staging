import { Component, ChangeDetectionStrategy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HeaderComponent, FooterComponent],
})
export class AboutComponent implements AfterViewInit {
  isMenuOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const Aos = (await import('aos')).default;
      Aos.init({
        disable: 'mobile',
      });
    }
  }
}
