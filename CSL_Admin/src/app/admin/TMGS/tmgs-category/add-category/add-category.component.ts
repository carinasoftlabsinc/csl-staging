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
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddCategoryComponent {
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
    public dialogRef: MatDialogRef<AddCategoryComponent>,
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
    

    });
  
    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        name: this.data_2.name,
      
      });

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
  //   blogData.append('name', formValue.name);
   
  
  //   if (this.mode === 'add') {
  //     this.service.AddCategory(blogData).subscribe({
  //       next: () => {
  //         this.showSuccessMessage('Team Member added successfully');
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
  //     this.service.UpdateCategory(this.ID!, blogData).subscribe({
  //       next: () => {
  //         this.showSuccessMessage('Team Member updated successfully');
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
    if (this.form.invalid) return;
  
    this.isLoading = true;
    const formValue = this.form.value;
  
    const blogData = {
      name: formValue.name
    };
  
    if (this.mode === 'add') {
      this.service.AddCategory(blogData).subscribe({
        next: () => {
          this.showSuccessMessage('Team Member added successfully');
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
      this.service.UpdateCategory(this.ID!, blogData).subscribe({
        next: () => {
          this.showSuccessMessage('Team Member updated successfully');
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
  

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
