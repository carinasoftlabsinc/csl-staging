import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

/**
 * Reusable pill button with the pink → blue gradient border.
 * Put it on an <a> or <button> so routerLink, href, type and click keep working:
 *   <button appGradientButton>Get Started</button>
 *   <a appGradientButton size="md" routerLink="/portfolio">More</a>
 *   <a appGradientButton variant="light" ...>  (white fill, for light sections)
 */
@Component({
  selector: 'a[appGradientButton], button[appGradientButton]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GradientButtonComponent {
  /** outline: dark fill (default) · soft: slate fill for dark cards · light: white fill and dark text for light sections. */
  @Input() variant: 'outline' | 'soft' | 'light' = 'outline';
  @Input() size: 'md' | 'lg' = 'lg';

  private static readonly base =
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-transparent font-quickSand font-medium text-white ' +
    'transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9B5DF7]';

  // The fill sits in the padding-box and the gradient in the border-box, so the border blends smoothly (no hard seam).
  private static readonly fills = {
    outline:
      '[background:linear-gradient(#0B0C10,#0B0C10)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box] ' +
      'hover:[background:linear-gradient(rgba(155,93,247,0.18),rgba(32,185,250,0.12)),linear-gradient(#0B0C10,#0B0C10)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box]',
    soft:
      '[background:linear-gradient(#34394B,#34394B)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box] ' +
      'hover:[background:linear-gradient(#424B65,#424B65)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box]',
    light:
      '!text-[#0B0C10] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box] ' +
      'hover:[background:linear-gradient(rgba(155,93,247,0.1),rgba(32,185,250,0.08)),linear-gradient(#fff,#fff)_padding-box,linear-gradient(to_bottom,#F21DF5,#20B9FA)_border-box]',
  };

  private static readonly sizes = {
    // Font sizes use ! because a global stylesheet otherwise forces 14px on buttons and links.
    lg: 'px-10 py-2.5 2xl:px-14 2xl:py-3 !text-base',
    md: 'px-4 py-2 lg:px-6 xl:py-2.5 2xl:px-8 2xl:py-3 !text-sm 2xl:!text-lg',
  };

  @HostBinding('class')
  get hostClass(): string {
    return `${GradientButtonComponent.base} ${GradientButtonComponent.fills[this.variant]} ${GradientButtonComponent.sizes[this.size]}`;
  }
}
