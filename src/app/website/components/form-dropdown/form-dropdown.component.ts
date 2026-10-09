import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Space kept between the field and the open list, plus a little breathing room. */
const PANEL_GAP = 12;

/** Lightweight styled select (no library) that works with formControlName. */
@Component({
  selector: 'app-form-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormDropdownComponent), multi: true },
  ],
  template: `
    <div class="font-quickSand">
      <span
        [id]="inputId + '-label'"
        class="block text-sm 2xl:text-lg leading-[0.988] 2xl:leading-[0.988] font-semibold uppercase text-[color:var(--q-text,#B4B9CB)] mb-2"
      >{{ label }}</span>
      <div class="relative">
      <button
        type="button"
        [id]="inputId"
        class="w-full flex items-center justify-between gap-3 h-8 2xl:h-[34px] border-b text-left transition-colors duration-200 focus:outline-none focus-visible:border-[color:var(--q-accent,#B4B9CB)]"
        [ngClass]="open ? 'border-[color:var(--q-accent,#B4B9CB)]' : 'border-[color:var(--q-line,#424B65)]'"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open"
        [attr.aria-controls]="inputId + '-list'"
        [attr.aria-labelledby]="inputId + '-label ' + inputId"
        [disabled]="disabled"
        (click)="toggle()"
        (keydown)="onKeydown($event)"
        (blur)="onTouched()"
      >
        <span class="truncate text-lg 2xl:text-lg font-medium" [ngClass]="value ? 'text-[color:var(--q-text,#B4B9CB)]' : 'text-[color:var(--q-muted,#6B7189)]'">
          {{ value || placeholder }}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4 shrink-0 text-[color:var(--q-text,#B4B9CB)] transition-transform duration-200" [class.rotate-180]="open" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 7 5 5 5-5" /></svg>
      </button>

      @if (open) {
        <ul
          [id]="inputId + '-list'"
          role="listbox"
          [attr.aria-labelledby]="inputId + '-label'"
          [ngClass]="dropUp ? 'bottom-full mb-1' : 'top-full mt-1'"
          class="dropdown-panel absolute left-0 right-0 z-20 max-h-72 overflow-auto rounded-xl border-[1px] border-[color:var(--q-panel-border,#34394B)] bg-[var(--q-panel,#16181F)] shadow-[0_8px_24px_var(--q-panel-shadow,rgba(0,0,0,0.5))]"
        >
          @for (option of options; track option; let i = $index) {
            <li
              role="option"
              [attr.aria-selected]="option === value"
              class="px-4 py-2 text-lg 2xl:text-lg font-medium cursor-pointer transition-colors duration-150"
              [ngClass]="
                option === value
                  ? 'bg-[var(--q-panel-hover,#23262F)] text-[color:var(--q-panel-active,#fff)] font-semibold'
                  : i === activeIndex
                    ? 'bg-[var(--q-panel-hover,#23262F)] text-[color:var(--q-panel-active,#fff)]'
                    : 'text-[color:var(--q-text,#B4B9CB)]'
              "
              (mouseenter)="activeIndex = i"
              (mousedown)="$event.preventDefault()"
              (click)="select(option)"
            >
              {{ option }}
            </li>
          }
        </ul>
      }
      </div>
    </div>
  `,
  styles: [
    `
      .dropdown-panel { animation: dropdown-in 0.15s ease-out; }
      @keyframes dropdown-in { from { opacity: 0; transform: translateY(-4px); } }
      @media (prefers-reduced-motion: reduce) { .dropdown-panel { animation: none; } }
    `,
  ],
})
export class FormDropdownComponent implements ControlValueAccessor {
  @Input({ required: true }) label = '';
  @Input({ required: true }) options: string[] = [];
  @Input() placeholder = 'Select';
  @Input({ required: true }) inputId = '';

  value = '';
  open = false;
  disabled = false;
  activeIndex = -1;
  /** Open above the field when there is not enough room below it in the viewport. */
  dropUp = false;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private host: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  toggle(): void {
    this.open ? this.close() : this.openPanel();
  }

  select(option: string): void {
    this.value = option;
    this.onChange(option);
    this.onTouched();
    this.close();
  }

  onKeydown(event: KeyboardEvent): void {
    const last = this.options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.openPanel();
          return;
        }
        this.activeIndex =
          event.key === 'ArrowDown' ? Math.min(last, this.activeIndex + 1) : Math.max(0, this.activeIndex - 1);
        break;
      case 'Home':
      case 'End':
        if (this.open) {
          event.preventDefault();
          this.activeIndex = event.key === 'Home' ? 0 : last;
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.open && this.activeIndex >= 0) {
          this.select(this.options[this.activeIndex]);
        } else {
          this.openPanel();
        }
        break;
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  private openPanel(): void {
    this.open = true;
    this.dropUp = false;
    this.activeIndex = Math.max(0, this.options.indexOf(this.value));
    // Render the list first so its real height can be measured, then flip it up only if it doesn't fit below.
    this.cdr.detectChanges();
    const el = this.host.nativeElement;
    const rect = (el.querySelector('button') ?? el).getBoundingClientRect();
    const listHeight = (el.querySelector('[role="listbox"]') as HTMLElement | null)?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    this.dropUp = spaceBelow < listHeight + PANEL_GAP && rect.top > spaceBelow;
  }

  private close(): void {
    this.open = false;
    this.activeIndex = -1;
  }
}
