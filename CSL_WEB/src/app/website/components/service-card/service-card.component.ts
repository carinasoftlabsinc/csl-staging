import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Icon + title + description card used in the service pages' scrolling rows.
 * The card styling lives on the host element, so a parent can place it directly in a
 * flex/scroll container (and add e.g. `scroll-item`) like any other flex child.
 */
@Component({
  selector: 'app-service-card',
  template: `
    <div class="p-3.5 !border border-[#34394B] rounded-full">
      <img class="size-12" [src]="icon" width="48" height="48" loading="lazy" decoding="async" [alt]="heading + ' icon'" />
    </div>
    <h3 class="text-2xl font-quickSand font-semibold text-center">{{ heading }}</h3>
    <p
      class="font-quickSand font-medium text-center text-xs 2xl:text-base 2xl:font-semibold border-t border-[#34394B] pt-3 text-[#B4B9CB]"
    >
      {{ description }}
    </p>
  `,
  host: {
    class: 'bg-[#34394B4D] flex flex-col items-center 2xl:px-6 2xl:py-16 rounded-[2.5rem] 2xl:rounded-[63px] relative cursor-pointer shrink-0 xl:shrink xl:w-[unset] px-6 py-12 gap-y-7 w-[304px] xl:w-64 text-white xl:flex-1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) heading!: string;
  @Input({ required: true }) description!: string;
}
