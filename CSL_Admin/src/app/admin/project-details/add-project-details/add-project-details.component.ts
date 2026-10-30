import { Component, ViewChild, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
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

/** One work step or development item: a title with its description. */
interface ProjectStep {
  title: string;
  description: string;
}

@Component({
  selector: 'app-add-project-details',
  templateUrl: './add-project-details.component.html',
  styleUrls: ['./add-project-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddProjectDetailsComponent implements OnInit, OnDestroy {
  private service = inject(BlogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dialogRef = inject<MatDialogRef<AddProjectDetailsComponent>>(MatDialogRef);
  private snackBar = inject(MatSnackBar);
  data_2 = inject(MAT_DIALOG_DATA);

  config2: AngularEditorConfig;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated = false;
  /** Set on Submit so required-image messages appear only after a save attempt. */
  submitted = false;

  /** File types the backend accepts for project images (no AVIF). */
  readonly uploadTypes = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Upload sizes shown to the content team, about 2x the size each image is displayed at on the website.
   * The upload field warns when an image is smaller or a different shape, and crops to this ratio.
   */
  readonly imageSpecs = {
    image: { width: 1800, height: 1150, hint: 'Case study header. Device mockups work best on a transparent PNG/WebP.' },
    image_2: { width: 1600, height: 900, hint: 'Portfolio card (16:9). Keep the key content in the centre.' },
    projectLogo: { width: 800, height: 320, hint: 'Logo on a transparent background, centred.' },
    overviewImage: { width: 800, height: 1200, hint: 'Portrait 2:3, a website or phone mockup on a transparent background.' },
    techImages: { width: 128, height: 128, label: 'Square, transparent PNG' },
    uiImages: { width: 1600, height: 1000, label: '16:10 screens or mockups' },
    resultImages: { width: 1600, height: 1200, label: '4:3' },
  };

  resultImagePreviews: (string | ArrayBuffer)[] = [];
  uiImagePreviews: (string | ArrayBuffer)[] = [];
  techImagePreviews: (string | ArrayBuffer)[] = [];
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor() {
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
      .subscribe((isAuthenticated: boolean) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      titleLink: new FormControl(null, Validators.required),
      description: new FormControl(null),
      category: new FormControl(null),
      about_title: new FormControl(null),
      aboutDescription: new FormControl(null),
      content: new FormControl(null),
      solutionContent: new FormControl(null),
      industry: new FormControl(null),
      deliverables: new FormControl(null),
      clientReview: new FormControl(null),
      clientName: new FormControl(null),
      designation: new FormControl(null),
      title_1: new FormControl(null),
      desc_1: new FormControl(null),
      title_2: new FormControl(null),
      desc_2: new FormControl(null),
      title_3: new FormControl(null),
      desc_3: new FormControl(null),
      image: new FormControl(null, Validators.required),
      image_2: new FormControl(null),
      aboutBg: new FormControl(null),
      how_image: new FormControl(null),
      tech: new FormControl(null),
      projectLogo: new FormControl(null, Validators.required),

      headingIcon: new FormControl(null),
      overviewImage: new FormControl(null),
      resultImages: new FormControl(null),
      uiImages: new FormControl(null),
      techImages: new FormControl(null),
      development: new FormArray([]),
      workSteps: new FormArray([]),
      overviewPara: new FormControl(null),
      resultHeading_1: new FormControl(null),
      resultHeading_2: new FormControl(null),
      keyHeading: new FormControl(null),
      goalsHeading1: new FormControl(null, Validators.required),
      goalsHeading2: new FormControl(null, Validators.required),
      goalsHeading3: new FormControl(null, Validators.required),
      keyDescription: new FormControl(null),
      userFlowDescription: new FormControl(null),
    });

    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        title: this.data_2.title,
        titleLink: this.data_2.titleLink,
        description: this.data_2.description,
        category: this.data_2.category,
        about_title: this.data_2.about_title,
        aboutDescription: this.data_2.aboutDescription,
        content: this.data_2.content,
        solutionContent: this.data_2.solutionContent,
        industry: this.data_2.industry,
        tech: this.data_2.tech,
        deliverables: this.data_2.deliverables,
        clientReview: this.data_2.clientReview,
        clientName: this.data_2.clientName,
        designation: this.data_2.designation,
        title_1: this.data_2.title_1,
        desc_1: this.data_2.desc_1,
        title_2: this.data_2.title_2,
        desc_2: this.data_2.desc_2,
        title_3: this.data_2.title_3,
        desc_3: this.data_2.desc_3,
        image: this.data_2.image,
        image_2: this.data_2.image_2,
        aboutBg: this.data_2.aboutBg,
        how_image: this.data_2.how_image,
        projectLogo: this.data_2.projectLogo,

        headingIcon: this.data_2.headingIcon,
        overviewImage: this.data_2.overviewImage,
        resultImages: this.data_2.resultImages,
        uiImages: this.data_2.uiImages,
        techImages: this.data_2.techImages,
        overviewPara: this.data_2.overviewPara,
        resultHeading_1: this.data_2.resultHeading_1,
        resultHeading_2: this.data_2.resultHeading_2,
        keyHeading: this.data_2.keyHeading,
        goalsHeading1: this.data_2.goalsHeading1,
        goalsHeading2: this.data_2.goalsHeading2,
        goalsHeading3: this.data_2.goalsHeading3,
        keyDescription: this.data_2.keyDescription,
        userFlowDescription: this.data_2.userFlowDescription,
      });
      if (this.data_2.developement?.length) {
        this.data_2.developement.forEach((dev: ProjectStep) => {
          (this.form.get('development') as FormArray).push(
            new FormGroup({
              title: new FormControl(dev.title),
              description: new FormControl(dev.description),
            })
          );
        });
      }

      if (this.data_2.workSteps?.length) {
        this.data_2.workSteps.forEach((step: ProjectStep) => {
          (this.form.get('workSteps') as FormArray).push(
            new FormGroup({
              title: new FormControl(step.title),
              description: new FormControl(step.description),
            })
          );
        });
      }

      this.resultImagePreviews = (this.data_2.resultImages ?? []).map((image: string) => this.imageBaseUrl + image);
      this.uiImagePreviews = (this.data_2.uiImages ?? []).map((image: string) => this.imageBaseUrl + image);
      this.techImagePreviews = (this.data_2.techImages ?? []).map((image: string) => this.imageBaseUrl + image);


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

  get developmentFormArray(): FormArray {
    return this.form.get('development') as FormArray;
  }
  
  get developmentControls(): FormGroup[] {
    return this.developmentFormArray.controls as FormGroup[];
  }
  
  
  addDev() {
    this.developmentFormArray.push(
      new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, [Validators.required])
      })
    );
  }
  
  removeDev(index: number) {
    this.developmentFormArray.removeAt(index);
  }


  get workStepsFormArray(): FormArray {
    return this.form.get('workSteps') as FormArray;
  }
  
  get workStepsControls(): FormGroup[] {
    return this.workStepsFormArray.controls as FormGroup[];
  }

  addWork() {
    if (this.workStepsFormArray.length < 5) {
      this.workStepsFormArray.push(
        new FormGroup({
          title: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required)
        })
      );
    }
  }
  
  removeWork(index: number) {
    if (this.workStepsFormArray.length > 5) {
      this.workStepsFormArray.removeAt(index);
    }
  }
  

  onResultImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);
  
      // Get existing files
      const existingFiles = (this.form.get('resultImages')?.value || []) as File[];
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

  onUiImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);
  
      // Get existing files
      const existingFiles = (this.form.get('uiImages')?.value || []) as File[];
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
      this.form.patchValue({ uiImages: updatedFiles });
  
      const newPreviews: string[] = [];
      let loadedCount = 0;
  
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
            loadedCount++;
  
            if (loadedCount === newFiles.length) {
              this.uiImagePreviews = [
                ...(this.uiImagePreviews || []),
                ...newPreviews,
              ];
            }
          }
        };
        reader.readAsDataURL(file);
      });
  
      const imageControl = this.form.get('uiImages');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }
  

  onRemoveUiImage(index: number) {
    if (this.uiImagePreviews) {
      this.uiImagePreviews.splice(index, 1);
    }
    const files = this.form.get('uiImages')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ uiImages: files });

    const imageControl = this.form.get('uiImages');
    if (imageControl) {
      imageControl.updateValueAndValidity();
    }
  }

  onTechImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);
  
      // Get existing files
      const existingFiles = (this.form.get('techImages')?.value || []) as File[];
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
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Explicitly map feed items to avoid them being serialized as strings
    const formValue = {
      ...this.form.value,
    };

    if (this.mode === 'add') {
      this.service
        .AddProject(
          formValue.title,
          formValue.titleLink,
          formValue.description,
          formValue.category,
          formValue.about_title,
          formValue.aboutDescription,
          formValue.content,
          formValue.solutionContent,
          formValue.industry,
          formValue.deliverables,
          formValue.clientReview,
          formValue.clientName,
          formValue.designation,
          formValue.title_1,
          formValue.desc_1,
          formValue.title_2,
          formValue.desc_2,
          formValue.title_3,
          formValue.desc_3,
          formValue.image,
          formValue.image_2,
          formValue.aboutBg,
          formValue.how_image,
          formValue.tech,
          formValue.projectLogo,
          formValue.headingIcon,
          formValue.overviewImage,
          formValue.resultImages,
          formValue.uiImages,
          formValue.techImages,
          formValue.development,
          formValue.workSteps,
          formValue.overviewPara,
          formValue.resultHeading_1,
          formValue.resultHeading_2,
          formValue.keyHeading,
          formValue.goalsHeading1,
          formValue.goalsHeading2,
          formValue.goalsHeading3,
          formValue.keyDescription,
          formValue.userFlowDescription
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
        .UpdateProject(
          formValue.title,
          formValue.titleLink,
          formValue.description,
          formValue.category,
          formValue.about_title,
          formValue.aboutDescription,
          formValue.content,
          formValue.solutionContent,
          formValue.industry,
          formValue.deliverables,
          formValue.clientReview,
          formValue.clientName,
          formValue.designation,
          formValue.title_1,
          formValue.desc_1,
          formValue.title_2,
          formValue.desc_2,
          formValue.title_3,
          formValue.desc_3,
          formValue.image,
          formValue.image_2,
          formValue.aboutBg,
          formValue.how_image,
          formValue.tech,
          formValue.projectLogo,
          formValue.headingIcon,
          formValue.overviewImage,
          formValue.resultImages,
          formValue.uiImages,
          formValue.techImages,
          formValue.development,
          formValue.workSteps,
          formValue.overviewPara,
          formValue.resultHeading_1,
          formValue.resultHeading_2,
          formValue.keyHeading,
          formValue.goalsHeading1,
          formValue.goalsHeading2,
          formValue.goalsHeading3,
          formValue.keyDescription,
          formValue.userFlowDescription,
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
