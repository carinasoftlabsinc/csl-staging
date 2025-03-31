import { Component } from '@angular/core';
import * as Aos from 'aos';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu() {
    this.isMenuOpen = false;
  } 

  ngAfterViewInit() {
    Aos.init({
      disable: 'mobile'
    });
  }
  
}
