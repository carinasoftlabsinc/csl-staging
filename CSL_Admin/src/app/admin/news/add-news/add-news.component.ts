import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'app/admin/blog.service';
import { AuthService } from 'app/authentication/authServices';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import type { RawEditorOptions } from 'tinymce';
import { ContentImageService, SELF_HOSTED_TINYMCE } from 'app/admin/content-editor/content-image.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss'],
  providers: [SELF_HOSTED_TINYMCE],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddNewsComponent {
  tinyInit: RawEditorOptions;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  imagePreview!: string | ArrayBuffer | null;
  imageBaseUrl = environment.imageBaseUrl;

  imagePreview2!: string | ArrayBuffer | null;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddNewsComponent>,
    private snackBar: MatSnackBar,
    private contentImages: ContentImageService,
    @Inject(MAT_DIALOG_DATA) public data_2: any
  ) {
    this.tinyInit = this.contentImages.tinyConfig('post');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      titleLink: new FormControl(null, Validators.required),
      description: new FormControl(null),
      author: new FormControl(null),
      date: new FormControl(null),
      content: new FormControl(null),
      feed: new FormArray([]),
      isFeature: new FormControl(false),
      isPreviousFeature: new FormControl(false),
      image: new FormControl(null, Validators.required),
      image_2: new FormControl(null, Validators.required),
    });

    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        title: this.data_2.title,
        titleLink: this.data_2.titleLink,
        description: this.data_2.description,
        author: this.data_2.author,
        date: this.data_2.date,
        content: this.data_2.content,
        isFeature: this.data_2.isFeature,
        isPreviousFeature: this.data_2.isPreviousFeature,
        image: this.data_2.image,
        image_2: this.data_2.image_2,
      });

      if (this.data_2.feed) {
        const feeds = this.data_2.feed || [];
        this.feed.clear();
        feeds.forEach((data: any) => {
          this.feed.push(new FormControl(data));
        });
      }

      if (this.data_2.image || this.data_2.image_2) {
        this.imagePreview = this.imageBaseUrl + this.data_2.image;
        this.imagePreview2 = this.imageBaseUrl + this.data_2.image_2;
        this.ID = this.data_2._id;
      }
      this.isLoading = false;
    } else {
      this.mode = 'add';
      this.isLoading = false;
    }
  }

  get feed(): FormArray {
    return this.form.get('feed') as FormArray;
  }

  add(): void {
    this.feed.push(new FormControl(null));
  }

  remove(index: number): void {
    this.feed.removeAt(index);
  }

  get title() {
    return this.form.get('title');
  }

  get titleLink() {
    return this.form.get('titleLink');
  }

  

  // onImagePicked(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const img = new Image();
  //     img.src = reader.result as string;

  //     img.onload = () => {
  //       // Define canvas with desired aspect ratio
  //       const canvas = document.createElement('canvas');
  //       canvas.width = 1104;
  //       canvas.height = 430;
  //       const ctx = canvas.getContext('2d');

  //       if (ctx) {
  //         // Calculate scaling to maintain the aspect ratio
  //         const scale = Math.min(
  //           canvas.width / img.width,
  //           canvas.height / img.height
  //         );
  //         const x = canvas.width / 2 - (img.width / 2) * scale;
  //         const y = canvas.height / 2 - (img.height / 2) * scale;

  //         // Draw image with scaling and positioning
  //         ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  //         this.imagePreview = canvas.toDataURL('image/png');

  //         // Optional: Save the image file for uploading
  //         canvas.toBlob((blob) => {
  //           if (blob) {
  //             const resizedFile = new File([blob], file.name, {
  //               type: 'image/png',
  //             });
  //             this.form.patchValue({ image: resizedFile });
  //             this.form.get('image')?.updateValueAndValidity();
  //           }
  //         }, 'image/png');
  //       }
  //     };
  //   };
  //   reader.readAsDataURL(file);
  // }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
  
    // Preview the original image (optional)
    this.imagePreview = URL.createObjectURL(file);
  
    // Use the original file for upload
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
  }
  

  onClearImage(): void {
    this.imagePreview = null;
    this.form.patchValue({ image: null });
    this.form.get('image')?.updateValueAndValidity();
  }

  // onImagePicked2(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const img = new Image();
  //     img.src = reader.result as string;

  //     img.onload = () => {
  //       // Define canvas with the desired aspect ratio
  //       const canvas = document.createElement('canvas');
  //       canvas.width = 394;
  //       canvas.height = 374;
  //       const ctx = canvas.getContext('2d');

  //       if (ctx) {
  //         // Calculate scaling to maintain the aspect ratio
  //         const scale = Math.min(
  //           canvas.width / img.width,
  //           canvas.height / img.height
  //         );
  //         const x = canvas.width / 2 - (img.width / 2) * scale;
  //         const y = canvas.height / 2 - (img.height / 2) * scale;

  //         // Draw the image with scaling and positioning
  //         ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  //         this.imagePreview2 = canvas.toDataURL('image/png');

  //         // Optional: Save the image file for uploading
  //         canvas.toBlob((blob) => {
  //           if (blob) {
  //             const resizedFile = new File([blob], file.name, {
  //               type: 'image/png',
  //             });
  //             this.form.patchValue({ image_2: resizedFile });
  //             this.form.get('image_2')?.updateValueAndValidity();
  //           }
  //         }, 'image/png');
  //       }
  //     };
  //   };
  //   reader.readAsDataURL(file);
  // }

  onImagePicked2(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
  
    // Preview the original image (optional)
    this.imagePreview2 = URL.createObjectURL(file);
  
    // Use the original file for upload
    this.form.patchValue({ image_2: file });
    this.form.get('image_2')?.updateValueAndValidity();
  }
  

  onClearImage2(): void {
    this.imagePreview2 = null;
    this.form.patchValue({ image_2: null });
    this.form.get('image_2')?.updateValueAndValidity();
  }

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: 'snackbar-success',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  private showErrorMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: 'snackbar-danger',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }
  // Other methods (onImagePicked, onClearImage, showSuccessMessage, showErrorMessage) remain the same

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    // Explicitly map feed items to avoid them being serialized as strings
    const formValue = {
      ...this.form.value,
    };

    if (this.mode === 'add') {
      this.service
        .AddNews(
          formValue.title,
          formValue.titleLink,
          formValue.description,
          formValue.author,
          formValue.date,
          formValue.content,
          formValue.feed,
          formValue.isFeature,
          formValue.isPreviousFeature,
          formValue.image,
          formValue.image_2
        )
        .subscribe({
          next: () => {
            this.showSuccessMessage('Data added successfully');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.showErrorMessage(error.message);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.service
        .UpdateNews(
          formValue.title,
          formValue.titleLink,
          formValue.description,
          formValue.author,
          formValue.date,
          formValue.content,
          formValue.feed,
          formValue.isFeature,
          formValue.isPreviousFeature,
          formValue.image,
          formValue.image_2,
          this.ID ?? ''
        )
        .subscribe({
          next: () => {
            this.showSuccessMessage('Data updated successfully');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.showErrorMessage(error.message);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
