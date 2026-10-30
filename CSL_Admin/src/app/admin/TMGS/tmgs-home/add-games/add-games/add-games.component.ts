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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipListbox } from '@angular/material/chips';



@Component({
  selector: 'app-add-games',
  templateUrl: './add-games.component.html',
  styleUrls: ['./add-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddGamesComponent {
  config2: AngularEditorConfig;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  imagePreview!: string | ArrayBuffer | null;
  imagePreview1!: string | ArrayBuffer | null;
  imagePreviewicon!: string | ArrayBuffer | null;
  imagePreview2!: string | ArrayBuffer | null;
  imagePreview3!: string | ArrayBuffer | null;
  imagePreview4!: string | ArrayBuffer | null;
  ctaimagePreview!: string | ArrayBuffer | null;
  featureimagePreview!: string | ArrayBuffer | null;
  overviewimagePreview!: string | ArrayBuffer | null;
  galleryImagePreviews: (string | ArrayBuffer)[] = [];
  techImagePreviews: (string | ArrayBuffer)[] = [];
  resultImagePreviews: (string | ArrayBuffer)[] = [];
  platformOptions: any[] = [];
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

@ViewChild('chipList') chipList!: MatChipListbox;
  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddGamesComponent>,
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
      name: new FormControl(null),
      iconImage: new FormControl(null),
      cardBackgroundImage: new FormControl(null),
      ratings: new FormControl(null),
      downloads: new FormControl(null),
      heroImage: new FormControl(null),
      online: new FormControl(null),
      playingNow: new FormControl(null),
      heading: new FormControl(null),
      content: new FormControl(null),
      trailerHeading: new FormControl(null),
      trailerImage: new FormControl(null),
      trailerLink: new FormControl(null),
      galleryImages: new FormControl(null),
      ctaImage: new FormControl(null),
      keywords: new FormControl<string[] | null>(null),
      platforms: new FormArray([]),
      socialLinks: new FormControl(null),
      ctaHeading: new FormControl(null),
      ctaDescription: new FormControl(null),
      isFeature: new FormControl(null),
      featuredImage: new FormControl(null),

      // new
      techImages: new FormControl(null),
      resultImages: new FormControl(null),
      workSteps: new FormArray([]),
      goals: new FormArray([]),
      overviewImage: new FormControl(null),
      industry: new FormControl(null),
      overviewPara: new FormControl(null),
       keytasks: new FormControl(null),
    });

    if (this.data_2) {
      this.mode = 'edit';

      this.keyTasks = this.data_2.keytasks || []; 

      this.form.patchValue({
        name: this.data_2.name,
        iconImage: this.data_2.iconImage,
        cardBackgroundImage: this.data_2.cardBackgroundImage,
        ratings: this.data_2.ratings,
        downloads: this.data_2.downloads,
        heroImage: this.data_2.heroImage,
        online: this.data_2.online,
        playingNow: this.data_2.playingNow,
        heading: this.data_2.heading,
        content: this.data_2.content,
        trailerHeading: this.data_2.trailer.heading,
        trailerImage: this.data_2.trailer.image,
        trailerLink: this.data_2.trailer.link,
        galleryImages: this.data_2.galleryImages,
        ctaImage: this.data_2.cta.ctaImage,
        keywords: this.data_2.keywords,
        // platforms: this.data_2.platforms.map((platform: any) => platform._id),
        socialLinks: this.data_2.socialLinks,
        ctaHeading: this.data_2.cta.heading,
        ctaDescription: this.data_2.cta.description,
        isFeature: this.data_2.isFeature,
        featuredImage: this.data_2.featuredImage,

        techImages: this.data_2.techImages,
        resultImages: this.data_2.resultImages,
        overviewImage: this.data_2.overviewImage,
        industry: this.data_2.industry,
        overviewPara: this.data_2.overviewPara,
        keytasks: this.data_2.keytasks,
      });

      const platformControls = (this.data_2.platforms || []).map(
        (platform: any) =>
          new FormGroup({
            name: new FormControl(platform.name, Validators.required),
            link: new FormControl(platform.link, [Validators.required]),
          })
      );

      const platformsArray = this.form.get('platforms') as FormArray;
      platformControls.forEach((control: any) => platformsArray.push(control));

      const workStepsControls = (this.data_2.workSteps || []).map(
        (workStep: any) =>
          new FormGroup({
            icon: new FormControl(workStep.icon, Validators.required),
            title: new FormControl(workStep.title, [Validators.required]),
            description: new FormControl(workStep.description, [
              Validators.required,
            ]),
          })
      );

      const workStepsArray = this.form.get('workSteps') as FormArray;
      workStepsControls.forEach((control: any) => workStepsArray.push(control));

      const goalsControls = (this.data_2.goals || []).map(
        (goal: any) =>
          new FormGroup({
            icon: new FormControl(goal.icon, Validators.required),
            title: new FormControl(goal.title, [Validators.required]),
            description: new FormControl(goal.description, [
              Validators.required,
            ]),
          })
      );

      const goalsArray = this.form.get('goals') as FormArray;
      goalsControls.forEach((control: any) => goalsArray.push(control));

      this.imagePreviewicon = this.imageBaseUrl + this.data_2.iconImage;
      this.imagePreview1 = this.imageBaseUrl + this.data_2.cardBackgroundImage;
      this.imagePreview2 = this.imageBaseUrl + this.data_2.heroImage;
      this.imagePreview4 = this.imageBaseUrl + this.data_2.trailerImage;
      this.ctaimagePreview = this.imageBaseUrl + this.data_2.ctaImage;
      this.featureimagePreview = this.imageBaseUrl + this.data_2.featuredImage;
      this.overviewimagePreview = this.imageBaseUrl + this.data_2.overviewImage;
      this.galleryImagePreviews = (this.data_2.galleryImages ?? []).map(
        (image: string) => this.imageBaseUrl + image
      );
      this.techImagePreviews = (this.data_2.techImages ?? []).map(
        (image: string) => this.imageBaseUrl + image
      );
      this.resultImagePreviews = (this.data_2.resultImages ?? []).map(
        (image: string) => this.imageBaseUrl + image
      );
      this.ID = this.data_2._id;
      this.isLoading = false;
    } else {
      this.mode = 'add';
      this.isLoading = false;
    }

    this.getPlatforms();
  }

  get platforms(): FormArray {
    return this.form.get('platforms') as FormArray;
  }

  addPlatform(name: string = '', link: string = ''): void {
    const platformGroup = new FormGroup({
      name: new FormControl(name, Validators.required),
      link: new FormControl(link, [Validators.required]),
    });
    this.platforms.push(platformGroup);
  }

  removePlatform(index: number): void {
    this.platforms.removeAt(index);
  }

  // worksteps
  get workSteps(): FormArray {
    return this.form.get('workSteps') as FormArray;
  }

  addWorkSteps(
    icon: string = '',
    title: string = '',
    description: string = ''
  ): void {
    const workStepsGroup = new FormGroup({
      icon: new FormControl(icon, Validators.required),
      title: new FormControl(title, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
    });
    this.workSteps.push(workStepsGroup);
  }

  removeWorkSteps(index: number): void {
    this.workSteps.removeAt(index);
  }

  // goals
  get goals(): FormArray {
    return this.form.get('goals') as FormArray;
  }

  addgoals(
    icon: string = '',
    title: string = '',
    description: string = ''
  ): void {
    const goalsGroup = new FormGroup({
      icon: new FormControl(icon, Validators.required),
      title: new FormControl(title, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
    });
    this.goals.push(goalsGroup);
  }

  removegoals(index: number): void {
    this.goals.removeAt(index);
  }

  // key task
  
separatorKeysCodes: number[] = [ENTER, COMMA];
keyTasks: string[] = [];

// addKeyTask(event: MatChipInputEvent): void {
//   const value = (event.value || '').trim();
//   if (value) {
//     this.keyTasks.push(value);
//   }
//   event.chipInput!.clear();
// }

// removeKeyTask(task: string): void {
//   const index = this.keyTasks.indexOf(task);
//   if (index >= 0) {
//     this.keyTasks.splice(index, 1);
//   }
// }
  
  addKeyTask(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value) {
    this.keyTasks.push(value);
    this.form.get('keytasks')?.setValue(this.keyTasks);
  }
  event.chipInput!.clear();
}

removeKeyTask(task: string): void {
  const index = this.keyTasks.indexOf(task);
  if (index >= 0) {
    this.keyTasks.splice(index, 1);
    this.form.get('keytasks')?.setValue(this.keyTasks);
  }
}



  // get feed(): FormArray {
  //   return this.form.get("feed") as FormArray;
  // }

  // add(): void {
  //   this.feed.push(
  //     new FormControl(null)
  //   );
  // }

  // remove(index: number): void {
  //   this.feed.removeAt(index);
  // }

  get title() {
    return this.form.get('title');
  }

  get titleLink() {
    return this.form.get('titleLink');
  }

  onImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ iconImage: file });

      const imageControl = this.form.get('iconImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage() {
    this.imagePreview = null;
    const imageControl = this.form.get('iconImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  // image2
  onImagePicked2(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ cardBackgroundImage: file });

      const imageControl = this.form.get('cardBackgroundImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview1 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage2() {
    this.imagePreview1 = null;
    const imageControl = this.form.get('cardBackgroundImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  onImagePickedicon(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ iconImage: file });

      const imageControl = this.form.get('iconImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreviewicon = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImageicon() {
    this.imagePreviewicon = null;
    const imageControl = this.form.get('iconImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  //
  onImagePicked3(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ heroImage: file });

      const imageControl = this.form.get('heroImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview2 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage3() {
    this.imagePreview2 = null;
    const imageControl = this.form.get('heroImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  //

  onImagePicked4(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ trailerImage: file });

      const imageControl = this.form.get('trailerImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview4 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage4() {
    this.imagePreview4 = null;
    const imageControl = this.form.get('trailerImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  onImagePicked5(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ ctaImage: file });

      const imageControl = this.form.get('ctaImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.ctaimagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage5() {
    this.ctaimagePreview = null;
    const imageControl = this.form.get('ctaImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  onImagePicked6(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ featuredImage: file });

      const imageControl = this.form.get('featuredImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.featureimagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage6() {
    this.featureimagePreview = null;
    const imageControl = this.form.get('featuredImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  onOverviewImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ overviewImage: file });

      const imageControl = this.form.get('overviewImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.overviewimagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearOverviewImage() {
    this.overviewimagePreview = null;
    const imageControl = this.form.get('overviewImage');
    if (imageControl) {
      imageControl.setValue(null);
    }
  }

  // onGalleryImagesPicked(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (inputElement.files && inputElement.files.length > 0) {
  //     const files = Array.from(inputElement.files);
  //     const imagePreviews: string[] = []; // Temporary array

  //     this.form.patchValue({ galleryImages: files });

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (reader.result) {
  //           imagePreviews.push(reader.result as string);

  //           // Only update after all images are loaded
  //           if (imagePreviews.length === files.length) {
  //             this.galleryImagePreviews = imagePreviews;
  //           }
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     });

  //     const imageControl = this.form.get('galleryImages');
  //     if (imageControl) {
  //       imageControl.updateValueAndValidity();
  //     }
  //   }
  // }

  // onGalleryImagesPicked(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (inputElement.files && inputElement.files.length > 0) {
  //     const newFiles = Array.from(inputElement.files);

  //     // Get existing files from the form
  //     const existingFiles = (this.form.get('galleryImages')?.value || []) as File[];
  //     const updatedFiles = [...existingFiles, ...newFiles];

  //     this.form.patchValue({ galleryImages: updatedFiles });

  //     // Generate new previews
  //     const newPreviews: string[] = [];
  //     let loadedCount = 0;

  //     newFiles.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (reader.result) {
  //           newPreviews.push(reader.result as string);
  //           loadedCount++;

  //           if (loadedCount === newFiles.length) {
  //             this.galleryImagePreviews = [
  //               ...(this.galleryImagePreviews || []),
  //               ...newPreviews,
  //             ];
  //           }
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     });

  //     const imageControl = this.form.get('galleryImages');
  //     if (imageControl) {
  //       imageControl.updateValueAndValidity();
  //     }
  //   }
  // }

  onGalleryImagesPicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);

      // Get existing files
      const existingFiles = (this.form.get('galleryImages')?.value ||
        []) as File[];
      const totalFiles = existingFiles.length + newFiles.length;

      // Limit to 10 images
      if (totalFiles > 10) {
        const remaining = 10 - existingFiles.length;
        if (remaining <= 0) {
          alert('You can upload a maximum of 10 images.');
          return;
        }
        newFiles.splice(remaining); // Keep only files that fit in the limit
      }

      const updatedFiles = [...existingFiles, ...newFiles];
      this.form.patchValue({ galleryImages: updatedFiles });

      const newPreviews: string[] = [];
      let loadedCount = 0;

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
            loadedCount++;

            if (loadedCount === newFiles.length) {
              this.galleryImagePreviews = [
                ...(this.galleryImagePreviews || []),
                ...newPreviews,
              ];
            }
          }
        };
        reader.readAsDataURL(file);
      });

      const imageControl = this.form.get('galleryImages');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }

  onRemoveGalleryImage(index: number) {
    if (this.galleryImagePreviews) {
      this.galleryImagePreviews.splice(index, 1);
    }
    const files = this.form.get('galleryImages')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ galleryImages: files });

    const imageControl = this.form.get('galleryImages');
    if (imageControl) {
      imageControl.updateValueAndValidity();
    }
  }
  onTechImagesPicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);

      // Get existing files
      const existingFiles = (this.form.get('techImages')?.value ||
        []) as File[];
      const totalFiles = existingFiles.length + newFiles.length;

      // Limit to 10 images
      if (totalFiles > 10) {
        const remaining = 10 - existingFiles.length;
        if (remaining <= 0) {
          alert('You can upload a maximum of 10 images.');
          return;
        }
        newFiles.splice(remaining); // Keep only files that fit in the limit
      }

      const updatedFiles = [...existingFiles, ...newFiles];
      this.form.patchValue({ techImages: updatedFiles });

      const newPreviews: string[] = [];
      let loadedCount = 0;

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
            loadedCount++;

            if (loadedCount === newFiles.length) {
              this.techImagePreviews = [
                ...(this.techImagePreviews || []),
                ...newPreviews,
              ];
            }
          }
        };
        reader.readAsDataURL(file);
      });

      const imageControl = this.form.get('techImages');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }

  onRemoveTechImage(index: number) {
    if (this.techImagePreviews) {
      this.techImagePreviews.splice(index, 1);
    }
    const files = this.form.get('techImages')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ techImages: files });

    const imageControl = this.form.get('techImages');
    if (imageControl) {
      imageControl.updateValueAndValidity();
    }
  }
  onResultImagesPicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);

      // Get existing files
      const existingFiles = (this.form.get('resultImages')?.value ||
        []) as File[];
      const totalFiles = existingFiles.length + newFiles.length;

      // Limit to 10 images
      if (totalFiles > 10) {
        const remaining = 10 - existingFiles.length;
        if (remaining <= 0) {
          alert('You can upload a maximum of 10 images.');
          return;
        }
        newFiles.splice(remaining); // Keep only files that fit in the limit
      }

      const updatedFiles = [...existingFiles, ...newFiles];
      this.form.patchValue({ resultImages: updatedFiles });

      const newPreviews: string[] = [];
      let loadedCount = 0;

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
            loadedCount++;

            if (loadedCount === newFiles.length) {
              this.resultImagePreviews = [
                ...(this.resultImagePreviews || []),
                ...newPreviews,
              ];
            }
          }
        };
        reader.readAsDataURL(file);
      });

      const imageControl = this.form.get('resultImages');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }

  onRemoveResultImage(index: number) {
    if (this.resultImagePreviews) {
      this.resultImagePreviews.splice(index, 1);
    }
    const files = this.form.get('resultImages')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ resultImages: files });

    const imageControl = this.form.get('resultImages');
    if (imageControl) {
      imageControl.updateValueAndValidity();
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

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    // Convert the keywords input into a JSON array
    // const keywordsArray = this.form.value.keywords
    //   .split(',')
    //   .map((keyword: string) => keyword.trim())
    //   .filter((keyword: string) => keyword);

    let keywordsArray: string[] = [];

    if (typeof this.form.value.keywords === 'string') {
      keywordsArray = this.form.value.keywords
        .split(',')
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword);
    } else if (Array.isArray(this.form.value.keywords)) {
      keywordsArray = this.form.value.keywords;
    }

    // const formValue = {
    //   ...this.form.value,
    //   keywords: keywordsArray,
    // };
    const formValue = {
      ...this.form.value,
      keywords: keywordsArray,
      platforms: this.form.value.platforms, // FormArray values are already in [{name, link}] format
      workSteps: this.form.value.workSteps, // FormArray values are already in [{name, link}] format
      goals: this.form.value.goals, // FormArray values are already in [{name, link}] format
      keytasks: this.keyTasks, 
    };
    if (this.mode === 'add') {
      this.service
        .AddGame(
          formValue.name,
          formValue.iconImage,
          formValue.cardBackgroundImage,
          formValue.ratings,
          formValue.downloads,
          formValue.heroImage,
          formValue.online,
          formValue.playingNow,
          formValue.heading,
          formValue.content,
          formValue.trailerHeading,
          formValue.trailerImage,
          formValue.trailerLink,
          formValue.galleryImages,
          formValue.ctaImage,
          formValue.keywords,
          formValue.platforms,
          formValue.socialLinks,
          formValue.ctaHeading,
          formValue.ctaDescription,
          formValue.isFeature,
          formValue.featuredImage,

          formValue.techImages,
          formValue.resultImages,
          formValue.workSteps,
          formValue.goals,
          formValue.overviewImage,
          formValue.overviewPara,
          formValue.industry,
          formValue.keytasks
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
        .UpdateGame(
          formValue.name,
          formValue.iconImage,
          formValue.cardBackgroundImage,
          formValue.ratings,
          formValue.downloads,
          formValue.heroImage,
          formValue.online,
          formValue.playingNow,
          formValue.heading,
          formValue.content,
          formValue.trailerHeading,
          formValue.trailerImage,
          formValue.trailerLink,
          formValue.galleryImages,
          formValue.ctaImage,
          formValue.keywords,
          formValue.platforms,
          formValue.socialLinks,
          formValue.ctaHeading,
          formValue.ctaDescription,
          formValue.isFeature,
          formValue.featuredImage,

          formValue.techImages,
          formValue.resultImages,
          formValue.workSteps,
          formValue.goals,
          formValue.overviewImage,
          formValue.overviewPara,
          formValue.industry,
          formValue.keytasks,
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

  getPlatforms() {
    this.service.getplatformsData(1, 100, '').subscribe({
      next: (res) => {
        this.platformOptions = res.data.platforms;
      },
      error: () => {
        // The error message is shown by the error interceptor.
      },
    });
  }

  validateEditorImages(html: string): {
    isValid: boolean;
    updatedContent: string;
  } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));

    const maxImages = 7;
    const maxImageSizeKb = 200;
    let isValid = true; // Assume valid until proven otherwise

    // Block the addition of the 6th image
    if (images.length > maxImages) {
      isValid = false;
      this.showErrorMessage(`⚠️ You can only add up to ${maxImages} images.`);
      // Remove the last added image (6th or extra)
      images.slice(maxImages).forEach((img) => img.remove());
    }

    // Check image sizes and remove invalid images
    images.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:image')) {
        const base64Length = src.length - (src.indexOf(',') + 1);
        const sizeInKB = (base64Length * 3) / 4 / 1024;

        if (sizeInKB > maxImageSizeKb) {
          img.remove(); // Remove image if it exceeds size limit
          isValid = false;
          this.showErrorMessage(
            `⚠️ Each image must be smaller than ${maxImageSizeKb} KB.`
          );
        }
      }
    });

    // After modifying the content (removing invalid images), we need to update the content
    const updatedContent = doc.body.innerHTML;

    return { isValid, updatedContent };
  }

  onContentChanged(content: string) {
    const result = this.validateEditorImages(content);

    if (!result.isValid) {
      this.form.get('content')?.setValue(result.updatedContent); // Set updated content with valid images only
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
