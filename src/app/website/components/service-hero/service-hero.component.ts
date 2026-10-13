import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Hero used by the service landing pages (Web Development, Digital Marketing, ...).
 * Header on top, two-line title, short text, optional button and an image beside it.
 * Below lg the image sits above the text; from lg it sits on the right.
 *
 *   <app-service-hero
 *     accent="WEB"
 *     headline="DEVELOPMENT"
 *     description="..."
 *     imageSrc="assets/images/web-hero.png"
 *     imageAlt="..."
 *     [imageWidth]="717"
 *     [imageHeight]="554"
 *   />
 */
@Component({
  selector: 'app-service-hero',
  templateUrl: './service-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ServiceHeroComponent {
  /** First (green) title word. */
  readonly accent = input.required<string>();
  /** Second (white) title word. Not called "title", which would also show as a hover tooltip. */
  readonly headline = input.required<string>();
  readonly description = input.required<string>();

  readonly imageSrc = input.required<string>();
  readonly imageAlt = input.required<string>();
  /** Real pixel size of the image file; it reserves the space so the page does not jump while loading. */
  readonly imageWidth = input(717);
  readonly imageHeight = input(554);
  /** Page-specific presentation without changing the other service heroes. */
  readonly imageClass = input('');

  /** Any CSS `background` value for the area behind the header and hero. */
  readonly background = input('#0B0C10 url(assets/images/digitalheroBG.png) no-repeat center / cover');

  /** Button label. Leave empty to hide the button. */
  readonly ctaLabel = input('Get Started');
  /** Optional route for the button. Without it the button renders as a plain <button>. */
  readonly ctaLink = input<string | null>(null);
  readonly ctaClick = output<MouseEvent>();
}
