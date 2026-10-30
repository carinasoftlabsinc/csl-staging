import { CommonModule } from '@angular/common';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CropperPosition, Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

export interface ImageCropDialogData {
  /** A new file, or the URL of an existing image. */
  file?: File;
  url?: string;
  title?: string;
  /** Recommended output size; gives the "Recommended" shape and the maximum output width. */
  recommendedWidth?: number | null;
  recommendedHeight?: number | null;
}

/** Result: the cropped file, the original file ("Use full image"), or undefined when cancelled. */
export type ImageCropDialogResult = { file: File; cropped: boolean } | undefined;

interface AspectOption {
  label: string;
  ratio: number | null; // null = free
}

@Component({
  selector: 'app-image-crop-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, ImageCropperComponent],
  templateUrl: './image-crop-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./image-crop-dialog.component.scss'],
})
export class ImageCropDialogComponent {
  readonly aspects: AspectOption[];
  aspect: AspectOption;
  transform: ImageTransform = { scale: 1, rotate: 0, flipH: false, flipV: false };
  canvasRotation = 0;
  /** The cropper is shown only after the dialog's opening animation, so it measures the final size. */
  opened = false;
  ready = false;
  failed = false;
  croppedSize = '';
  private cropped: ImageCroppedEvent | null = null;
  /** Size of the shown image (from cropperReady); used to put the Free box around the whole image. */
  private shownSize: Dimensions | null = null;
  /** Bound to [cropper]: setting a new object moves the box. */
  cropperPosition: CropperPosition | undefined;
  /**
   * Bound to [cropperMaxWidth] as "no limit". The cropper keeps the maximum box size of the last fixed shape
   * and only recalculates it when this input changes, so it is nudged when switching to Free.
   */
  cropperMaxWidth = 100000;

  /** PNG keeps transparency; other images become JPG. */
  readonly format: 'png' | 'jpeg';

  constructor(
    private dialogRef: MatDialogRef<ImageCropDialogComponent, ImageCropDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ImageCropDialogData
  ) {
    const w = data.recommendedWidth;
    const h = data.recommendedHeight;
    this.aspects = [
      ...(w && h ? [{ label: `Recommended (${w} × ${h})`, ratio: w / h }] : []),
      { label: 'Free', ratio: null },
      { label: '1:1', ratio: 1 },
      { label: '4:3', ratio: 4 / 3 },
      { label: '16:9', ratio: 16 / 9 },
    ];
    this.aspect = this.aspects[0];
    // PNG and WebP may be transparent: crop them to PNG so the transparency survives. JPEG has none to keep.
    const type = data.file?.type || (data.url && /\.(png|webp)($|\?)/i.test(data.url) ? 'image/png' : '');
    this.format = type === 'image/png' || type === 'image/webp' ? 'png' : 'jpeg';
    this.dialogRef.afterOpened().subscribe(() => (this.opened = true));
  }

  get title(): string {
    return this.data.title || 'Crop image';
  }

  get maxOutputWidth(): number {
    return this.data.recommendedWidth || 1600;
  }

  /**
   * A new shape starts from the largest box of that shape. Fixed shapes are reset by the cropper itself;
   * Free gets a box around the whole image through the [cropper] input.
   */
  setAspect(option: AspectOption) {
    this.aspect = option;
    if (option.ratio === null) this.selectWholeImage();
  }

  onReady(size: Dimensions) {
    this.ready = true;
    this.shownSize = size;
  }

  private selectWholeImage() {
    if (!this.shownSize) return;
    this.cropperMaxWidth = this.cropperMaxWidth === 100000 ? 100001 : 100000;
    this.cropperPosition = { x1: 0, y1: 0, x2: this.shownSize.width, y2: this.shownSize.height };
  }

  rotate(step: 1 | -1) {
    this.canvasRotation = (this.canvasRotation + step + 4) % 4;
  }

  flip(axis: 'h' | 'v') {
    this.transform = axis === 'h' ? { ...this.transform, flipH: !this.transform.flipH } : { ...this.transform, flipV: !this.transform.flipV };
  }

  zoom(step: number) {
    const scale = Math.min(4, Math.max(0.5, +((this.transform.scale || 1) + step).toFixed(2)));
    this.transform = { ...this.transform, scale };
  }

  reset() {
    this.canvasRotation = 0;
    this.transform = { scale: 1, rotate: 0, flipH: false, flipV: false };
    this.aspect = this.aspects[0];
  }

  onCropped(event: ImageCroppedEvent) {
    this.cropped = event;
    this.croppedSize = `${event.width} × ${event.height}`;
  }

  apply() {
    const blob = this.cropped?.blob;
    if (!blob) return;
    const base = (this.data.file?.name || this.data.url?.split('/').pop() || 'image').replace(/\.[^.]+$/, '');
    const ext = this.format === 'png' ? 'png' : 'jpg';
    const file = new File([blob], `${base}-cropped.${ext}`, { type: this.format === 'png' ? 'image/png' : 'image/jpeg' });
    this.dialogRef.close({ file, cropped: true });
  }

  useOriginal() {
    if (this.data.file) this.dialogRef.close({ file: this.data.file, cropped: false });
    else this.dialogRef.close(undefined);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
