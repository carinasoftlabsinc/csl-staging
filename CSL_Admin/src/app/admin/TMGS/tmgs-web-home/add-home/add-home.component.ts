import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'app/admin/blog.service';
import { AuthService } from 'app/authentication/authServices';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.component.html',
  styleUrls: ['./add-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddHomeComponent {
 config2: AngularEditorConfig;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  imagePreview!: string | ArrayBuffer | null;
  // imagePreview1!: string | ArrayBuffer | null;
  imagePreviewicon!: string | ArrayBuffer | null;
  imagePreview2!: string | ArrayBuffer | null;
  imagePreview3!: string | ArrayBuffer | null;
  imagePreview4!: string | ArrayBuffer | null;
  ctaimagePreview!: string | ArrayBuffer | null;
  aboutCardImagePreview!: string | ArrayBuffer | null;
  featureimagePreview!: string | ArrayBuffer | null;
  eventImagePreviews: (string | ArrayBuffer)[] = [];
  platformOptions: any[] = [];
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddHomeComponent>,
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
      heroHeading: new FormControl(null),
      heroSubHeading: new FormControl(null),
      heroMainTopics: new FormControl(null),
      heroDescription: new FormControl(null),
  
      aboutHeading: new FormControl(null),
      aboutSubHeading: new FormControl(null),
      aboutDescription: new FormControl(null),
      aboutExperience: new FormControl(null),
      aboutPoints: new FormArray([]),
      aboutCardBackgroundImage: new FormControl(null),
  
      gamesHeading: new FormControl(null),
      gamesSubHeading: new FormControl(null),
      gamesDescription: new FormControl(null),
  
      teamHeading: new FormControl(null),
      teamSubHeading: new FormControl(null),
      teamDescription: new FormControl(null),
      uniqueDailyUsers: new FormControl(null),
      downloads: new FormControl(null),
      gamesLaunched: new FormControl(null),
      upcomingGames: new FormControl(null),
  
      visitedHeading: new FormControl(null),
      visitedSubHeading: new FormControl(null),
      visitedDescription: new FormControl(null),
  
      eventImages: new FormControl(null),

      visitedEventsJoinHeading: new FormControl(null),
    visitedEventsJoinDescription: new FormControl(null),

    careerHeading: new FormControl(null),
    careerSubHeading: new FormControl(null),
    careerDescription: new FormControl(null),

    ctaHeading: new FormControl(null),
    ctaSubHeading: new FormControl(null),
    ctaDescription: new FormControl(null),
    ctaImage: new FormControl(null),
    });
  
    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        heroHeading: this.data_2.heroSection.heading,
        heroSubHeading: this.data_2.heroSection.subHeading,
        heroMainTopics: this.data_2.heroSection.mainTopics,
        heroDescription: this.data_2.heroSection.description,
  
        aboutHeading: this.data_2.about.heading,
        aboutSubHeading: this.data_2.about.subHeading,
        aboutDescription: this.data_2.about.description,
        aboutExperience: this.data_2.about.experience,
        // aboutPoints: this.data_2.about.points,
        aboutCardBackgroundImage: this.data_2.aboutCardBackgroundImage,
  
        gamesHeading: this.data_2.games.heading,
        gamesSubHeading: this.data_2.games.subHeading,
        gamesDescription: this.data_2.games.description,
  
        teamHeading: this.data_2.ourTeam.heading,
        teamSubHeading: this.data_2.ourTeam.subHeading,
        teamDescription: this.data_2.ourTeam.description,
        uniqueDailyUsers: this.data_2.ourTeam.statistics.uniqueDailyUsers,
        downloads: this.data_2.ourTeam.statistics.downloads,
        gamesLaunched: this.data_2.ourTeam.statistics.gamesLaunched,
        upcomingGames: this.data_2.ourTeam.statistics.upcomingGames,
  
        visitedHeading: this.data_2.visitedEvents.heading,
        visitedSubHeading: this.data_2.visitedEvents.subHeading,
        visitedDescription: this.data_2.visitedEvents.description,
  
        eventImages: this.data_2.eventImages,

        visitedEventsJoinHeading: this.data_2.visitedEvents?.joinHeading,
        visitedEventsJoinDescription: this.data_2.visitedEvents?.joinDescription,
  
        careerHeading: this.data_2.career?.heading,
        careerSubHeading: this.data_2.career?.subHeading,
        careerDescription: this.data_2.career?.description,
  
        ctaHeading: this.data_2.cta?.heading,
        ctaSubHeading: this.data_2.cta?.subHeading,
        ctaDescription: this.data_2.cta?.description,
        ctaImage: this.data_2.ctaImage,
      });
  
       // handle aboutPoints FormArray
  const aboutPointsArray = this.form.get('aboutPoints') as FormArray;
  if (this.data_2.about?.points && Array.isArray(this.data_2.about.points)) {
    this.data_2.about.points.forEach((point: any) => {
      aboutPointsArray.push(
        new FormGroup({
          pointHeading: new FormControl(point.pointHeading),
          pointDescription: new FormControl(point.pointDescription),
        })
      );
    });
  }

      // Optional: set preview images if needed
      this.aboutCardImagePreview = this.imageBaseUrl + this.data_2.aboutCardBackgroundImage;
      this.ctaimagePreview = this.imageBaseUrl + this.data_2.ctaImage;
      this.eventImagePreviews = (this.data_2.eventImages ?? []).map((img: string) => this.imageBaseUrl + img);
  
      this.ID = this.data_2._id;
      this.isLoading = false;
    } else {
      this.mode = 'add';
      this.isLoading = false;
    }
  
    // Optional: Call a service if needed
    // this.getAdditionalData();
  }
  

  get title() {
    return this.form.get('title');
  }

  get titleLink() {
    return this.form.get('titleLink');
  }

  // points
  get aboutPoints(): FormArray {
    return this.form.get('aboutPoints') as FormArray;
  }
  
  addAboutPoint() {
    this.aboutPoints.push(
      new FormGroup({
        pointHeading: new FormControl(''),
        pointDescription: new FormControl(''),
      })
    );
  }
  
  removeAboutPoint(index: number) {
    this.aboutPoints.removeAt(index);
  }
  
  
  // points end

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
      this.form.patchValue({ aboutCardBackgroundImage: file });

      const imageControl = this.form.get('aboutCardBackgroundImage');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.aboutCardImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage2() {
    this.aboutCardImagePreview = null;
    const imageControl = this.form.get('aboutCardBackgroundImage');
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

  // onGalleryImagesPicked(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (inputElement.files && inputElement.files.length > 0) {
  //     const files = Array.from(inputElement.files);
  //     const imagePreviews: string[] = []; // Temporary array

  //     this.form.patchValue({ eventImages: files });

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (reader.result) {
  //           imagePreviews.push(reader.result as string);

  //           // Only update after all images are loaded
  //           if (imagePreviews.length === files.length) {
  //             this.eventImagePreviews = imagePreviews;
  //           }
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     });

  //     const imageControl = this.form.get('eventImages');
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
      const existingFiles = (this.form.get('eventImages')?.value || []) as File[];
      const totalFiles = existingFiles.length + newFiles.length;
  
      // Limit to 10 images
      if (totalFiles > 5) {
        const remaining = 5 - existingFiles.length;
        if (remaining <= 0) {
          alert('You can upload a maximum of 5 images.');
          return;
        }
        newFiles.splice(remaining); // Trim to allowed number
      }
  
      const updatedFiles = [...existingFiles, ...newFiles];
      this.form.patchValue({ eventImages: updatedFiles });
  
      const newPreviews: string[] = [];
      let loadedCount = 0;
  
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
            loadedCount++;
  
            if (loadedCount === newFiles.length) {
              this.eventImagePreviews = [
                ...(this.eventImagePreviews || []),
                ...newPreviews,
              ];
            }
          }
        };
        reader.readAsDataURL(file);
      });
  
      const imageControl = this.form.get('eventImages');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }
  

  onRemoveGalleryImage(index: number) {
    if (this.eventImagePreviews) {
      this.eventImagePreviews.splice(index, 1);
    }
    const files = this.form.get('eventImages')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ galleryImages: files });

    const imageControl = this.form.get('eventImages');
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

  // onSave() {
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;
  //     let keywordsArray: string[] = [];

  //     if (typeof this.form.value.keywords === 'string') {
  //       keywordsArray = this.form.value.keywords
  //         .split(',')
  //         .map((keyword: string) => keyword.trim())
  //         .filter((keyword: string) => keyword);
  //     } else if (Array.isArray(this.form.value.keywords)) {
  //       keywordsArray = this.form.value.keywords;
  //     }
    
  //   const formValue = {
  //     ...this.form.value,
  //     keywords: keywordsArray,
  //   };

  //   if (this.mode === 'add') {
  //     this.service
  //       .AddGame(
  //         formValue.name,
  //         formValue.iconImage,
  //         formValue.cardBackgroundImage,
  //         formValue.ratings,
  //         formValue.downloads,
  //         formValue.heroImage,
  //         formValue.online,
  //         formValue.playingNow,
  //         formValue.heading,
  //         formValue.content,
  //         formValue.trailerHeading,
  //         formValue.trailerImage,
  //         formValue.trailerLink,
  //         formValue.galleryImages,
  //         formValue.ctaImage,
  //         formValue.keywords,
  //         formValue.platforms,
  //         formValue.socialLinks,
  //         formValue.ctaHeading,
  //         formValue.ctaDescription,
  //         formValue.isFeature,
  //         formValue.featuredImage
  //       )
  //       .subscribe({
  //         next: () => {
  //           this.showSuccessMessage('Data added successfully');
  //           this.dialogRef.close(true);
  //         },
  //         error: (error) => {
  //           this.isLoading = false;
  //           this.showErrorMessage(error.message);
  //         },
  //         complete: () => {
  //           this.isLoading = false;
  //         },
  //       });
  //   } else {
  //     this.service
  //       .UpdateGame(
  //         formValue.name,
  //         formValue.iconImage,
  //         formValue.cardBackgroundImage,
  //         formValue.ratings,
  //         formValue.downloads,
  //         formValue.heroImage,
  //         formValue.online,
  //         formValue.playingNow,
  //         formValue.heading,
  //         formValue.content,
  //         formValue.trailerHeading,
  //         formValue.trailerImage,
  //         formValue.trailerLink,
  //         formValue.galleryImages,
  //         formValue.ctaImage,
  //         formValue.keywords,
  //         formValue.platforms,
  //         formValue.socialLinks,
  //         formValue.ctaHeading,
  //         formValue.ctaDescription,
  //         formValue.isFeature,
  //         formValue.featuredImage,
  //         this.ID ?? ''
  //       )
  //       .subscribe({
  //         next: () => {
  //           this.showSuccessMessage('Data updated successfully');
  //           this.dialogRef.close(true);
  //         },
  //         error: (error) => {
  //           this.isLoading = false;
  //           this.showErrorMessage(error.message);
  //         },
  //         complete: () => {
  //           this.isLoading = false;
  //         },
  //       });
  //   }
  // }


  onSave() {
    if (this.form.invalid) {
      return;
    }
  
    this.isLoading = true;
  
    const formValue = this.form.value;
  
    const heroSection = {
      heading: formValue.heroHeading,
      subHeading: formValue.heroSubHeading,
      mainTopics: formValue.heroMainTopics,
      description: formValue.heroDescription
    };
  
    const about = {
      heading: formValue.aboutHeading,
      subHeading: formValue.aboutSubHeading,
      description: formValue.aboutDescription,
      experience: formValue.aboutExperience,
      points: formValue.aboutPoints
    };
  
    const aboutCardBackgroundImage = formValue.aboutCardBackgroundImage;


  
    const games = {
      heading: formValue.gamesHeading,
      subHeading: formValue.gamesSubHeading,
      description: formValue.gamesDescription
    };
  
    const ourTeam = {
      heading: formValue.teamHeading,
      subHeading: formValue.teamSubHeading,
      description: formValue.teamDescription,
      statistics: {
        uniqueDailyUsers: formValue.uniqueDailyUsers,
        downloads: formValue.downloads,
        gamesLaunched: formValue.gamesLaunched,
        upcomingGames: formValue.upcomingGames
      }
    };
  
    const visitedEvents = {
      heading: formValue.visitedHeading,
      subHeading: formValue.visitedSubHeading,
      description: formValue.visitedDescription,
      joinHeading: formValue.visitedEventsJoinHeading,
      joinDescription: formValue.visitedEventsJoinDescription
    };
  
    const career = {
      heading: formValue.careerHeading,
      subHeading: formValue.careerSubHeading,
      description: formValue.careerDescription
    };
  
    const cta = {
      heading: formValue.ctaHeading,
      subHeading: formValue.ctaSubHeading,
      description: formValue.ctaDescription,
     
    };

    const ctaImage = formValue.ctaImage
  
    const eventImages = formValue.eventImages;
  
    // ADD mode
    if (this.mode === 'add') {
      this.service
        .AddHome(
          heroSection,
          about,
          aboutCardBackgroundImage,
          games,
          ourTeam,
          visitedEvents,
          eventImages,
          career,
          cta,
          ctaImage,
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
          }
        });
    } 
    // EDIT mode
    else {
      this.service
        .UpdateHome(
          heroSection,
          about,
          aboutCardBackgroundImage,
          games,
          ourTeam,
          visitedEvents,
          eventImages,
          career,
          cta,
          ctaImage
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
          }
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

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
