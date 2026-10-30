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
  selector: 'app-add-image-upload',
  templateUrl: './add-image-upload.component.html',
  styleUrls: ['./add-image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddImageUploadComponent {
config2: AngularEditorConfig;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  imagePreview!: string | ArrayBuffer | null;
  galleryImagePreviews: (string | ArrayBuffer)[] = [];
  categoryOptions: any[] = [];
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddImageUploadComponent>,
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

  folderList: string[] = [];
  selectedFolder: string = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.getFolderList(); 
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
  
    this.form = new FormGroup({

      image: new FormControl(null),

    });
  
    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
    
        image: this.data_2.image,

      });

      this.galleryImagePreviews = this.data_2.image.map((image: string) => this.imageBaseUrl + image);
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

  onGalleryImagesPicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files && inputElement.files.length > 0) {
      const newFiles = Array.from(inputElement.files);
  
      // Get existing files
      const existingFiles = (this.form.get('image')?.value || []) as File[];
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
      this.form.patchValue({ image: updatedFiles });
  
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
  
      const imageControl = this.form.get('image');
      if (imageControl) {
        imageControl.updateValueAndValidity();
      }
    }
  }
  

  onRemoveGalleryImage(index: number) {
    if (this.galleryImagePreviews) {
      this.galleryImagePreviews.splice(index, 1);
    }
    const files = this.form.get('image')?.value as File[];
    files.splice(index, 1);
    this.form.patchValue({ image: files });

    const imageControl = this.form.get('image');
    if (imageControl) {
      imageControl.updateValueAndValidity();
    }
  }
  
  triggerFilePicker(input: HTMLInputElement) {
    if (!this.galleryImagePreviews || this.galleryImagePreviews.length < 10) {
      input.click();
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
  
    if (!this.selectedFolder) {
      this.showErrorMessage('Please select a folder.');
      return;
    }
  
    const formData = new FormData();
  
    // Append image files
    const images = this.form.get('image')?.value as File[];
    images.forEach((file: File) => formData.append('image', file));
    
    this.service
      .uploadImagesForPath(formData, this.selectedFolder)
      .subscribe({
        next: () => {
          this.showSuccessMessage('Images uploaded successfully');
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


  // API to get folder list
  getFolderList(): void {
    this.service.getImageFolders().subscribe((response: any) => {
      this.folderList = response?.data || [];
    }, () => {
      // The error message is shown by the error interceptor.
    });
  }
  
  // When folder is changed
  // onFolderChange(): void {
  //   this.page = 1;
  //   this.getData();
  // }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}


