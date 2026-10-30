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
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-ads',
  templateUrl: './add-ads.component.html',
  styleUrls: ['./add-ads.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddAdsComponent {
  config2: AngularEditorConfig;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  adImagePreview!: string | ArrayBuffer | null;
  videoPreview: string | null = null;
  featureimagePreview!: string | ArrayBuffer | null;
  eventImagePreviews!: (string | ArrayBuffer)[] | null;
  categoryOptions: any[] = [];
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddAdsComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data_2: any
  ) {
    this.config2 = {
      toolbarPosition: 'top',
      editable: true,
      spellcheck: true,
      height: '20rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [['bold']],
      customClasses: [
        { name: 'quote', class: 'quote' },
        { name: 'redText', class: 'redText' },
        { name: 'titleText', class: 'titleText', tag: 'h1' },
      ],
    };
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
      name: new FormControl(null, Validators.required),
      orientation: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      videoFile: new FormControl(null),
      videoUrl: new FormControl(null),
      duration: new FormControl(null, Validators.required),
      viewThreshold: new FormControl(null, Validators.required),
      platforms: new FormArray([]),
    });
    // ✅ Add this right here:
    this.form.get('videoFile')?.valueChanges.subscribe((file) => {
      if (file) this.form.get('videoUrl')?.reset();
    });

    this.form.get('videoUrl')?.valueChanges.subscribe((url) => {
      if (url) this.form.get('videoFile')?.reset();
    });

    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        name: this.data_2.name,
        orientation: this.data_2.orientation,
        videoUrl: this.data_2.videoUrl,
        duration: this.data_2.duration,
        viewThreshold: this.data_2.viewThreshold,
        image: this.data_2.image,
        // videoFile: this.data_2.videoFile,
      });
      // Patch platforms array if needed
      if (this.data_2.platforms?.length) {
        this.data_2.platforms.forEach((platform: any) => {
          (this.form.get('platforms') as FormArray).push(
            new FormGroup({
              name: new FormControl(platform.name),
              url: new FormControl(platform.url),
            })
          );
        });
      }
      this.adImagePreview = this.imageBaseUrl + this.data_2.image;
      this.videoPreview = this.imageBaseUrl + this.data_2.videoFile;
      this.ID = this.data_2._id;
      this.isLoading = false;
    } else {
      this.mode = 'add';
      this.isLoading = false;
    }
  }

  get title() {
    return this.form.get('title');
  }

  get titleLink() {
    return this.form.get('titleLink');
  }

  get platformsFormArray(): FormArray {
    return this.form.get('platforms') as FormArray;
  }

  get platformControls(): FormGroup[] {
    return this.platformsFormArray.controls as FormGroup[];
  }

  addPlatform() {
    this.platformsFormArray.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        url: new FormControl(null, [Validators.required]),
      })
    );
  }

  removePlatform(index: number) {
    this.platformsFormArray.removeAt(index);
  }

  onVideoPicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.videoPreview = reader.result as string;
        this.form.patchValue({ videoFile: file });
        this.form.get('videoUrl')?.disable(); // Disable URL if video is selected
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoUrlInput(): void {
    const url = this.form.get('videoUrl')?.value;
    if (url) {
      this.videoPreview = null;
      this.form.patchValue({ videoFile: null });
      this.form.get('videoFile')?.reset();
    }
  }

  onClearVideo() {
    this.form.get('videoFile')?.reset();
    this.videoPreview = null;
  }

  // image2
  onImagePicked2(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ image: file });

      const imageControl = this.form.get('image');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.adImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage2() {
    this.adImagePreview = null;
    const imageControl = this.form.get('image');
    if (imageControl) {
      imageControl.setValue(null);
    }
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

  // onSave() {
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;

  //   const formValue = this.form.value;

  //   const blogData = new FormData();
  //   blogData.append('title', formValue.title);
  //   blogData.append('description', formValue.description);
  //   blogData.append('employmentType', formValue.employmentType);
  //   blogData.append('location', formValue.location);
  //   blogData.append('experience', formValue.experience);
  //   blogData.append('applicationDeadline', formValue.applicationDeadline);
  //   blogData.append('content', formValue.content);

  //   if (typeof formValue.image === 'object') {
  //     blogData.append('image', formValue.image);
  //   } else {
  //     blogData.append('image', formValue.image);
  //   }

  //   if (this.mode === 'add') {
  //     this.service.AddCareerPost(blogData).subscribe({
  //       next: () => {
  //         this.showSuccessMessage('Blog added successfully');
  //         this.dialogRef.close(true);
  //       },
  //       error: (error) => {
  //         this.isLoading = false;
  //         this.showErrorMessage(error.message);
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.service.UpdateCareerPost(this.ID!, blogData).subscribe({
  //       next: () => {
  //         this.showSuccessMessage('Blog updated successfully');
  //         this.dialogRef.close(true);
  //       },
  //       error: (error) => {
  //         this.isLoading = false;
  //         this.showErrorMessage(error.message);
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const formValue = this.form.value;
    const adData = new FormData();

    adData.append('name', formValue.name);
    adData.append('orientation', formValue.orientation);
    adData.append('duration', formValue.duration);
    adData.append('viewThreshold', formValue.viewThreshold);

    // ✅ Append image
    if (typeof formValue.image === 'object') {
      adData.append('image', formValue.image);
    }

    // ✅ Append only one video field
    if (formValue.videoFile) {
      adData.append('videoFile', formValue.videoFile);
    } else if (formValue.videoUrl) {
      adData.append('videoUrl', formValue.videoUrl);
    }

    // ✅ Append platforms array as JSON string
    const platforms = this.form.get('platforms')?.value || [];
    adData.append('platforms', JSON.stringify(platforms));

    if (this.mode === 'add') {
      this.service.addAd(adData).subscribe({
        next: () => {
          this.showSuccessMessage('Ad added successfully');
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
      this.service.updateAd(this.ID!, adData).subscribe({
        next: () => {
          this.showSuccessMessage('Ad updated successfully');
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

  getCategories() {
    this.service.getAllCategoriesData(1, 100, '').subscribe({
      next: (res) => {
        this.categoryOptions = res.data;
      },
      error: () => {
        // The error message is shown by the error interceptor.
      },
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
