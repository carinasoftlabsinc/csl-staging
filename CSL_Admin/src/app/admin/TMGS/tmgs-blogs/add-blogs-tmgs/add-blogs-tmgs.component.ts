import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
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
import { HttpClient } from '@angular/common/http';
import type { RawEditorOptions } from 'tinymce';

const BACKEND_URL = environment.apiUrl + '/admin/';

@Component({
  selector: 'app-add-blogs-tmgs',
  templateUrl: './add-blogs-tmgs.component.html',
  styleUrls: ['./add-blogs-tmgs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AddBlogsTmgsComponent {
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

   editorKey = '0g9agqhf4dootsbujt579l12214vyhtbetnqekwlckqekoe8'

  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private service: BlogService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddBlogsTmgsComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data_2: any,
    public http: HttpClient
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
      titleLink: new FormControl(null),
      image: new FormControl(null),
      category: new FormControl(null),
      time: new FormControl(null),
      author: new FormControl(null),
      content: new FormControl(null),
       faqs: new FormArray([]),
    });

    if (this.data_2) {
      this.mode = 'edit';
      this.form.patchValue({
        title: this.data_2.title,
        titleLink: this.data_2.titleLink,
        category: this.data_2.category._id,
        time: this.data_2.time,
        author: this.data_2.author,
        content: this.data_2.content,
        image: this.data_2.image,
      });

            const faqsControls = (this.data_2.faqs || []).map(
              (faq: any) =>
                new FormGroup({
                  question: new FormControl(faq.question, Validators.required),
                  answer: new FormControl(faq.answer, [Validators.required]),
                  
                })
            );
      
           const faqsArray = this.form.get('faqs') as FormArray;
            faqsControls.forEach((control: any) => faqsArray.push(control));
      

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

    // faqs
  get faqs(): FormArray {
    return this.form.get('faqs') as FormArray;
  }

  addfaqs(question: string = '', answer: string = ''): void {
    const faqsGroup = new FormGroup({
      question: new FormControl(question, Validators.required),
      answer: new FormControl(answer, [Validators.required]),
    });
    this.faqs.push(faqsGroup);
  }

  removefaqs(index: number): void {
    this.faqs.removeAt(index);
  }

  getAnswerControl(faq: AbstractControl): FormControl {
  return faq.get('answer') as FormControl;
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
    blogData.append('titleLink', formValue.titleLink);
    blogData.append('author', formValue.author);
    blogData.append('time', formValue.time);
    blogData.append('content', formValue.content);
    blogData.append('category', formValue.category);

    if (typeof formValue.image === 'object') {
      blogData.append('image', formValue.image);
    } else {
      blogData.append('image', formValue.image);
    }

    // Handle FAQs
  const faqsArray = this.form.get('faqs') as FormArray;
  const faqs = faqsArray.value;
  blogData.append('faqs', JSON.stringify(faqs)); 

    if (this.mode === 'add') {
      this.service.AddBlog(blogData).subscribe({
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
        },
      });
    } else {
      this.service.UpdateBlog(this.ID!, blogData).subscribe({
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
        },
      });
    }
  }

  getCategories() {
    this.service.getAllCategoriesData(1, 100, '').subscribe({
      next: (res) => {
        // Filter only active categories
        this.categoryOptions = res.data.filter(
          (category: any) => category.isActive === true
        );
      },
      error: () => {
        // The error message is shown by the error interceptor.
      },
    });
  }

  

 tinyConfig: RawEditorOptions = {
  height: 500,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount',
    'codesample', 'emoticons', 'directionality', 'template',
  ],
  toolbar: [
    'undo redo | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat',
    'code codesample emoticons | ltr rtl | template | preview fullscreen | help'
  ].join(' '),
  style_formats: [
    { title: 'Headings', items: [
      { title: 'Heading 1', block: 'h1' },
      { title: 'Heading 2', block: 'h2' },
      { title: 'Heading 3', block: 'h3' },
      { title: 'Heading 4', block: 'h4' },
      { title: 'Heading 5', block: 'h5' },
      { title: 'Heading 6', block: 'h6' },
    ]},
    { title: 'Blocks', items: [
      { title: 'Paragraph', block: 'p' },
      { title: 'Blockquote', block: 'blockquote' },
      { title: 'Div', block: 'div' },
    ]},
    { title: 'Inline', items: [
      { title: 'Bold', inline: 'strong' },
      { title: 'Italic', inline: 'em' },
      { title: 'Underline', inline: 'u' },
      { title: 'Strikethrough', inline: 'strike' },
      { title: 'Superscript', inline: 'sup' },
      { title: 'Subscript', inline: 'sub' },
      { title: 'Code', inline: 'code' },
    ]},
  ],
  toolbar_mode: 'floating',
  content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
  link_title: true,
  link_target_list: [
    { text: 'None', value: '' },
    { text: 'New window', value: '_blank' },
    { text: 'Same window', value: '_self' },
  ],
  link_rel_list: [
    { text: 'None', value: '' },
    { text: 'nofollow', value: 'nofollow' },
    { text: 'noopener', value: 'noopener' },
    { text: 'noreferrer', value: 'noreferrer' },
  ],
  images_upload_handler: (
    blobInfo: any,
    progress: (percent: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BACKEND_URL}uploadImageEditor/tmgsBlogs`, true);

      // Add authentication header
      const token = localStorage.getItem('token') || this.authService.getToken(); // Adjust based on your auth setup
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      } else {
        reject(new Error('No authentication token found. Please log in.'));
        return;
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          progress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          if (result.url) {
            resolve(result.url);
          } else {
            reject(new Error('Upload failed: No URL returned'));
          }
        } else {
          const errorResponse = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          reject(new Error(`Upload failed: ${errorResponse.message || 'Server error'}`));
        }
      };

      xhr.onerror = () => reject(new Error('Image upload failed'));

      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());
      xhr.send(formData);
    });
  },
  templates: [
    { title: 'Call to Action', description: 'A simple CTA button', content: '<p><a href="#" class="btn btn-primary">Click Here</a></p>' },
    { title: 'Quote', description: 'A styled quote block', content: '<blockquote><p>Your quote here</p><cite>Author</cite></blockquote>' },
  ],
};

  tinyConfigFaq: RawEditorOptions = {
  height: 300, // Smaller height for FAQs
  menubar: false, // No menubar for simplicity
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'paste', 'wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat',
  content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
  images_upload_handler: this.tinyConfig.images_upload_handler, // Reuse the same upload handler
};
  
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
