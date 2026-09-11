import { Component, Input } from '@angular/core';
import * as Aos from 'aos';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {
  ngAfterViewInit() {
    Aos.init({
      disable: 'mobile',
    });
  }
  @Input() showCollab: boolean = true; // Control visibility of collab card button

  @Input() btnText: string = 'Schedule a call';
  @Input() cardText: string =
    'HAVE PROJECT IN MIND ? <br class="hidden sm:block" /> LET’S COLLABORATE.';
  @Input() btnLink: string = 'https://calendly.com/mayank-pande12/30min';

  @Input() showButton: boolean = true; // Control visibility of "GET IN TOUCH" button
  @Input() buttonText: string = 'GET IN TOUCH'; // Button text
  @Input() showHeading: boolean = true; // Control visibility of the heading
  @Input() headingText: string = 'Let’s create something amazing'; // Heading text
  mail = ' business@carinasoftlabs.com';
  // Scroll to top functionality
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
