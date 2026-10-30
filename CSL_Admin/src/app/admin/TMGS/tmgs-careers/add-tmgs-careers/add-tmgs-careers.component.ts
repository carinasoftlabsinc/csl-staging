import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'app/admin/blog.service';
import { AuthService } from 'app/authentication/authServices';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-tmgs-careers',
  templateUrl: './add-tmgs-careers.component.html',
  styleUrls: ['./add-tmgs-careers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddTmgsCareersComponent {
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
  blogImagePreview!: string | ArrayBuffer | null;
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
    public dialogRef: MatDialogRef<AddTmgsCareersComponent>,
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

      title: new FormControl(null),
      description: new FormControl(null),
      image: new FormControl(null),
      employmentType: new FormControl(null),
      location: new FormControl(null),
      experience: new FormControl(null),
      applicationDeadline: new FormControl(null),
      content: new FormControl(null),

    });
  
    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        title: this.data_2.title,
        description: this.data_2.description,
        employmentType: this.data_2.employmentType,
        location: this.data_2.location,
        experience: this.data_2.experience,
        applicationDeadline: this.data_2.applicationDeadline,
        content: this.data_2.content,
        image: this.data_2.image,

      });

      this.blogImagePreview = this.imageBaseUrl + this.data_2.image;
      this.ID = this.data_2._id;
      this.isLoading = false;
    } else {
      this.mode = 'add';
      this.isLoading = false;
    }
  
    this.getCategories();
  }
  

  get title() {
    return this.form.get('title');
  }

  get titleLink() {
    return this.form.get('titleLink');
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
          this.blogImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onClearImage2() {
    this.blogImagePreview = null;
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
  
  
  onSave() {
    if (this.form.invalid) {
      return;
    }
  
    this.isLoading = true;
  
    const formValue = this.form.value;
  
    const blogData = new FormData();
    blogData.append('title', formValue.title);
    blogData.append('description', formValue.description);
    blogData.append('employmentType', formValue.employmentType);
    blogData.append('location', formValue.location);
    blogData.append('experience', formValue.experience); 
    blogData.append('applicationDeadline', formValue.applicationDeadline); 
    blogData.append('content', formValue.content);
  
    
    if (typeof formValue.image === 'object') {
      blogData.append('image', formValue.image);
    } else {
      blogData.append('image', formValue.image); 
    }
  
    if (this.mode === 'add') {
      this.service.AddCareerPost(blogData).subscribe({
        next: () => {
          this.showSuccessMessage('Blog added successfully');
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
    } else {
      this.service.UpdateCareerPost(this.ID!, blogData).subscribe({
        next: () => {
          this.showSuccessMessage('Blog updated successfully');
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
  
  validateEditorImages(html: string): { isValid: boolean, updatedContent: string } {
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
      images.slice(maxImages).forEach(img => img.remove());
    }
  
    // Check image sizes and remove invalid images
    images.forEach(img => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:image')) {
        const base64Length = src.length - (src.indexOf(',') + 1);
        const sizeInKB = (base64Length * 3) / 4 / 1024;
  
        if (sizeInKB > maxImageSizeKb) {
          img.remove(); // Remove image if it exceeds size limit
          isValid = false;
          this.showErrorMessage(`⚠️ Each image must be smaller than ${maxImageSizeKb} KB.`);
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
