import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterLink } from './footer.data';

/** One footer link: a router link for our pages, a new-tab link for external sites. */
@Component({
  selector: 'app-footer-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (route(); as route) {
      <a [routerLink]="route" [class]="linkClass()">{{ link().label }}</a>
    } @else {
      <a [href]="href()" [class]="linkClass()" target="_blank" rel="noopener noreferrer">{{ link().label }}</a>
    }
  `,
  host: { class: 'contents' },
})
export class FooterLinkComponent {
  readonly link = input.required<FooterLink>();
  readonly linkClass = input('');

  protected readonly route = computed(() => {
    const link = this.link();
    return 'route' in link ? link.route : null;
  });
  protected readonly href = computed(() => {
    const link = this.link();
    return 'href' in link ? link.href : null;
  });
}
