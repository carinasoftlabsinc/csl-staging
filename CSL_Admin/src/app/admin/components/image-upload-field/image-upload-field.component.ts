import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageCropDialogComponent, ImageCropDialogData, ImageCropDialogResult } from './image-crop-dialog.component';

/** Value of the field: a new File, the saved path/URL of an existing image, or null. */
export type ImageFieldValue = File | string | null;

interface ImageInfo {
  name: string;
  sizeKb: number | null;
  width: number;
  height: number;
}

const DEFAULT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

/**
 * Reusable image picker for admin forms (works with formControlName / ngModel).
 * Drag & drop, click, keyboard (Enter/Space); crop dialog (shape presets,
 * rotate, flip, zoom); preview with crop/replace/remove; type, size and recommended-dimension checks.
 *
 *   <app-image-upload-field formControlName="image" label="Header image" [required]="true"
 *     [baseUrl]="imageBaseUrl" [recommendedWidth]="1104" [recommendedHeight]="430"></app-image-upload-field>
 */
@Component({
  selector: 'app-image-upload-field',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule],
  templateUrl: './image-upload-field.component.html',
  styleUrls: ['./image-upload-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageUploadFieldComponent), multi: true }],
})
export class ImageUploadFieldComponent implements ControlValueAccessor, OnDestroy {
  @Input() label = 'Image';
  @Input() hint = '';
  @Input() required = false;
  /** Prefix for saved paths such as "/blog/x.png" (full URLs are used as they are). */
  @Input() baseUrl = '';
  /** Allowed MIME types. */
  @Input() acceptTypes: string[] = DEFAULT_TYPES;
  @Input() maxSizeMb = 10;
  /** Recommended size: shows a warning when the image is smaller or has a clearly different shape. */
  @Input() recommendedWidth: number | null = null;
  @Input() recommendedHeight: number | null = null;
  /** Height of the preview / drop area in px. */
  @Input() previewHeight = 180;
  /** Open the crop dialog after an image is picked, and show a Crop button. */
  @Input() crop = true;
  /** Set by the parent form when it wants errors shown (e.g. after a save attempt). */
  @Input() showErrors = false;

  /** Emits every new file the user picks (also available through the form control). */
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  previewUrl: string | null = null;
  info: ImageInfo | null = null;
  error = '';
  dragging = false;
  disabled = false;
  touched = false;

  private objectUrl: string | null = null;
  /** The current value, so the Crop button can re-open the dialog with it. */
  private current: ImageFieldValue = null;
  private dragDepth = 0;
  private onChange: (value: ImageFieldValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) {}

  get accept(): string {
    return this.acceptTypes.join(',');
  }

  get typesLabel(): string {
    return this.acceptTypes.map((t) => t.replace('image/', '').toUpperCase().replace('JPEG', 'JPG')).join(', ');
  }

  get hasImage(): boolean {
    return !!this.previewUrl;
  }

  get showRequired(): boolean {
    return this.required && !this.hasImage && (this.touched || this.showErrors);
  }

  /** Warning about the picked image's dimensions compared with the recommended size. */
  get sizeWarning(): string {
    const w = this.recommendedWidth;
    const h = this.recommendedHeight;
    if (!this.info || !w || !h) return '';
    if (this.info.width < w * 0.75 || this.info.height < h * 0.75) {
      return `Small image (${this.info.width} × ${this.info.height}); ${w} × ${h} or larger looks sharper.`;
    }
    const ratio = this.info.width / this.info.height;
    const wanted = w / h;
    if (Math.abs(ratio - wanted) / wanted > 0.2) {
      return `Different shape than recommended (${w} × ${h}); parts may be cropped on the website.`;
    }
    return '';
  }

  // ---- ControlValueAccessor ----

  writeValue(value: ImageFieldValue): void {
    this.error = '';
    this.current = value || null;
    if (value instanceof File) {
      this.showFile(value);
    } else if (typeof value === 'string' && value) {
      this.revokeObjectUrl();
      this.previewUrl = /^(https?:|data:|blob:)/.test(value) ? value : this.baseUrl + value;
      this.info = null;
      this.readDimensions(this.previewUrl, value.split('/').pop() || value, null);
    } else {
      this.clearPreview();
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: ImageFieldValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ---- user actions ----

  openPicker() {
    if (!this.disabled) this.fileInput.nativeElement.click();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openPicker();
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) this.pick(file);
  }

  onDragEnter(event: DragEvent) {
    if (this.disabled || !this.hasFiles(event)) return;
    event.preventDefault();
    this.dragDepth++;
    this.dragging = true;
  }

  onDragOver(event: DragEvent) {
    if (this.disabled || !this.hasFiles(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent) {
    if (this.disabled || !this.hasFiles(event)) return;
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (!this.dragDepth) this.dragging = false;
  }

  onDrop(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.pick(file);
  }

  remove(event?: Event) {
    event?.stopPropagation();
    if (this.disabled) return;
    this.clearPreview();
    this.current = null;
    this.error = '';
    this.markTouched();
    this.onChange(null);
  }

  markTouched() {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  // ---- internals ----

  private pick(file: File) {
    this.markTouched();
    const problem = this.validate(file);
    if (problem) {
      this.error = problem;
      this.cdr.markForCheck();
      return;
    }
    this.error = '';
    if (this.crop) this.openCrop({ file });
    else this.useFile(file);
  }

  /** Crop button on the preview: crop the current image again (new file or saved image). */
  cropCurrent(event?: Event) {
    event?.stopPropagation();
    if (this.disabled || !this.current) return;
    if (this.current instanceof File) this.openCrop({ file: this.current });
    else if (this.previewUrl) this.openCrop({ url: this.previewUrl });
  }

  private openCrop(source: Pick<ImageCropDialogData, 'file' | 'url'>) {
    const ref = this.dialog.open<ImageCropDialogComponent, ImageCropDialogData, ImageCropDialogResult>(ImageCropDialogComponent, {
      data: { ...source, title: `Crop ${this.label.toLowerCase()}`, recommendedWidth: this.recommendedWidth, recommendedHeight: this.recommendedHeight },
      width: '900px',
      maxWidth: '95vw',
      autoFocus: false,
    });
    // Cancel keeps whatever was there before.
    ref.afterClosed().subscribe((result) => {
      if (result?.file) this.useFile(result.file);
      this.cdr.markForCheck();
    });
  }

  private useFile(file: File) {
    this.current = file;
    this.showFile(file);
    this.onChange(file);
    this.fileSelected.emit(file);
    this.cdr.markForCheck();
  }

  private validate(file: File): string {
    if (!this.acceptTypes.includes(file.type)) return `"${file.name}" is not a supported image. Use ${this.typesLabel}.`;
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      return `"${file.name}" is ${(file.size / 1048576).toFixed(1)} MB; the limit is ${this.maxSizeMb} MB.`;
    }
    return '';
  }

  private showFile(file: File) {
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.previewUrl = this.objectUrl;
    this.info = null;
    this.readDimensions(this.objectUrl, file.name, Math.round(file.size / 1024));
  }

  private readDimensions(url: string, name: string, sizeKb: number | null) {
    const img = new Image();
    img.onload = () => {
      if (this.previewUrl !== url) return;
      this.info = { name, sizeKb, width: img.naturalWidth, height: img.naturalHeight };
      this.cdr.markForCheck();
    };
    img.src = url;
  }

  private hasFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types || []).includes('Files');
  }

  private clearPreview() {
    this.revokeObjectUrl();
    this.previewUrl = null;
    this.info = null;
  }

  private revokeObjectUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }
}
