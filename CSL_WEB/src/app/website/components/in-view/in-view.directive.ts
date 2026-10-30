import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input, signal } from '@angular/core';

/**
 * Adds the class `is-visible` while the element is on screen, so a CSS animation can wait until it is seen:
 *   <div appInView class="art">  ->  .art { animation-play-state: paused }  .art.is-visible { animation-play-state: running }
 * Does nothing on the server.
 */
@Directive({
  selector: '[appInView]',
  host: { '[class.is-visible]': 'visible()' },
})
export class InViewDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Share of the element that must be visible (0 to 1). */
  readonly threshold = input(0.15, { alias: 'appInViewThreshold' });
  protected readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => this.visible.set(entry.isIntersecting), {
        threshold: this.threshold(),
      });
      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
