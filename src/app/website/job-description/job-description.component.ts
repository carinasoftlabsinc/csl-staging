// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-job-description',
//   templateUrl: './job-description.component.html',
//   styleUrls: ['./job-description.component.scss']
// })
// export class JobDescriptionComponent {

// }

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'done';
  hideProgress?: boolean;
  errorMessage?: string;
}

interface JobPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  skillImage: string[];
  roleCategory: string;
  employmentType: string;
  location: string;
  experience: string;
  noOfPositions: number;
  applicationDeadline: string;
  salary: string;
  isFeatured: boolean;
  active: boolean;
  createdAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    data: JobPost[]; // Array of JobPosts
  };
}

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
})
export class JobDescriptionComponent {
  jobPost!: JobPost;
  apiUrl = `${environment.apiUrl}/admin/getAllCareerJobPost`;
  imageUrl = `${environment.imageBaseUrl}`;

  jobForm!: FormGroup;
  selectedFile: File | null = null;
  uploadedFileName: string = '';
  formSubmitted: boolean = false;
  // uploadedFiles: UploadedFile[] = [];
  uploadedFiles: Array<UploadedFile> = [];

  uploadStatus: 'uploading' | 'success' | 'error' | 'done' | '' = '';
  uploadProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    console.log('Skill Images:', this.jobPost?.skillImage);

    if (jobId) {
      this.fetchJobPost(jobId);
    }

    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // phone: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'), // This ensures only digits are allowed
        ],
      ],
      // resume: [null, Validators.required],
      // resume: [null],
      resume: [null, [Validators.required]],
    });
  }

  jobId = this.route.snapshot.paramMap.get('id');

  fetchJobPost(id: string): void {
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        // Find the job post that matches the given ID
        const foundJob = response.data.data.find((job) => job._id === id);

        if (foundJob) {
          this.jobPost = foundJob; // Set the job post data
        } else {
          console.error('Job post not found');
        }
      },
      error: (error) => {
        console.error('Error fetching job post data:', error);
      },
    });
  }

  //for fallback

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/job-fallback.png';
  }

  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  // onDrop(event: DragEvent): void {
  //   event.preventDefault();
  //   this.isDragging = false;
  //   const file = event.dataTransfer?.files?.[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.jobForm.patchValue({ resume: file });
  //     this.uploadedFileName = file.name;
  //     this.jobForm.get('resume')?.setValue(file);
  //     this.jobForm.get('resume')?.markAsTouched(); // Mark as touched
  //     this.jobForm.get('resume')?.updateValueAndValidity(); // Trigger validation
  //     this.resumeTouched = true;
  //     this.resumeUploaded = true;
  //   }
  // }

  readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  markFileAsSuccess(file: any) {
    file.status = 'success';
    file.progress = 100;

    // Show green progress bar briefly
    file.hideProgress = false;

    setTimeout(() => {
      file.hideProgress = true;
    }, 1000); // Hide after 1 second
  }

  // onDrop(event: DragEvent): void {
  //   event.preventDefault();
  //   this.isDragging = false;
  //   const file = event.dataTransfer?.files?.[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.jobForm.patchValue({ resume: file });
  //     this.uploadedFileName = file.name;
  //     this.jobForm.get('resume')?.setValue(file);
  //     this.jobForm.get('resume')?.markAsTouched();
  //     this.jobForm.get('resume')?.updateValueAndValidity();
  //     this.resumeTouched = true;
  //     this.resumeUploaded = true;

  //     // 👉 Upload UI
  //     this.handleFileUpload(file);
  //   }
  // }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed.');
        return;
      }

      if (file.size > this.MAX_FILE_SIZE) {
        alert('File size should not exceed 25MB.');
        return;
      }

      this.selectedFile = file;
      this.jobForm.patchValue({ resume: file });
      this.uploadedFileName = file.name;
      this.jobForm.get('resume')?.setValue(file);
      this.jobForm.get('resume')?.markAsTouched();
      this.jobForm.get('resume')?.updateValueAndValidity();
      this.resumeTouched = true;
      this.resumeUploaded = true;

      this.handleFileUpload(file);
    }
  }

  resumeUploaded: boolean = false;
  resumeTouched: boolean = false;

  // onFileChange(event: any): void {
  //   this.resumeTouched = true;

  //   const file = event.target.files[0];
  //   this.jobForm.get('resume')?.markAsTouched();
  //   if (file) {
  //     this.jobForm.get('resume')?.setValue(file);
  //     this.selectedFile = file;
  //     this.jobForm.patchValue({ resume: file });
  //     this.uploadedFileName = file.name;
  //     this.resumeUploaded = true;
  //   } else {
  //     this.selectedFile = null;
  //     this.uploadedFileName = '';
  //     this.resumeUploaded = false;
  //     this.jobForm.get('resume')?.setValue(null);
  //   }
  // }

  openFile(file: UploadedFile): void {
    const fileURL = URL.createObjectURL(file.file);
    window.open(fileURL, '_blank');
  }

  // onFileChange(event: any): void {
  //   this.resumeTouched = true;

  //   const file = event.target.files[0];
  //   this.jobForm.get('resume')?.markAsTouched();
  //   if (file) {
  //     this.jobForm.get('resume')?.setValue(file);
  //     this.selectedFile = file;
  //     this.uploadedFileName = file.name;
  //     this.resumeUploaded = true;

  //     // 👉 Upload UI
  //     this.handleFileUpload(file);
  //   } else {
  //     this.selectedFile = null;
  //     this.uploadedFileName = '';
  //     this.resumeUploaded = false;
  //     this.jobForm.get('resume')?.setValue(null);
  //   }
  // }

  // onFileChange(event: any): void {
  //   this.resumeTouched = true;

  //   const file = event.target.files[0];
  //   this.jobForm.get('resume')?.markAsTouched();

  //   if (file) {
  //     if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
  //       alert('Only PDF, DOC, and DOCX files are allowed.');
  //       this.clearFileInput();
  //       return;
  //     }

  //     if (file.size > this.MAX_FILE_SIZE) {
  //       alert('File size should not exceed 25MB.');
  //       this.clearFileInput();
  //       return;
  //     }

  //     this.jobForm.get('resume')?.setValue(file);
  //     this.selectedFile = file;
  //     this.uploadedFileName = file.name;
  //     this.resumeUploaded = true;

  //     this.handleFileUpload(file);
  //   } else {
  //     this.clearFileInput();
  //   }
  // }

  // clearFileInput(): void {
  //   this.selectedFile = null;
  //   this.uploadedFileName = '';
  //   this.resumeUploaded = false;
  //   this.jobForm.get('resume')?.setValue(null);

  //   const fileInput = document.querySelector(
  //     'input[type="file"]'
  //   ) as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }

  //   this.cdr.detectChanges();
  // }

  onFileChange(event: any): void {
    this.resumeTouched = true;
    const file = event.target.files[0];

    if (file) {
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed.');
        this.clearFileInput();
        return;
      }

      if (file.size > this.MAX_FILE_SIZE) {
        alert('File size should not exceed 25MB.');
        this.clearFileInput();
        return;
      }

      this.jobForm.get('resume')?.setValue(file);
      this.selectedFile = file;
      this.uploadedFileName = file.name;
      this.resumeUploaded = true;

      // Make sure form validation is re-evaluated
      this.jobForm.get('resume')?.markAsTouched();
      this.jobForm.get('resume')?.updateValueAndValidity();

      this.handleFileUpload(file);
    } else {
      this.clearFileInput();
    }
  }

  clearFileInput(): void {
    this.selectedFile = null;
    this.uploadedFileName = '';
    this.resumeUploaded = false;
    this.jobForm.get('resume')?.setValue(null);
    this.jobForm.get('resume')?.markAsTouched(); // Mark as touched to trigger validation
    this.jobForm.get('resume')?.updateValueAndValidity(); // Update validity

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input value
    }

    this.cdr.detectChanges();
  }

  handleFileUpload(file: File): void {
    this.selectedFile = file;
    this.jobForm.patchValue({ resume: file });
    this.jobForm.get('resume')?.setValue(file);
    this.resumeUploaded = true;
    this.uploadedFileName = file.name;

    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      progress: 0,
      status: 'uploading',
    };
    this.uploadedFiles = [uploadedFile]; // Only one file shown at a time
    this.uploadStatus = 'uploading';
    this.uploadProgress = 0;

    const interval = setInterval(() => {
      if (uploadedFile.progress < 100) {
        uploadedFile.progress += 10;
        this.uploadProgress = uploadedFile.progress;
      } else {
        clearInterval(interval);
        const success = Math.random() > 0.3;
        uploadedFile.status = success ? 'success' : 'error';
        this.uploadStatus = uploadedFile.status;
      }
    }, 200);
  }

  // ✅ ADDED: Remove file
  removeFile(file?: UploadedFile): void {
    if (file) {
      this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
    } else {
      this.uploadedFiles = [];
    }
    this.selectedFile = null;
    this.uploadedFileName = '';
    this.resumeUploaded = false;
    this.uploadProgress = 0;
    this.uploadStatus = '';
    this.jobForm.get('resume')?.setValue(null);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input value
    }

    this.cdr.detectChanges();
  }

  // ✅ ADDED: Retry failed upload
  retryUpload(file: UploadedFile): void {
    file.progress = 0;
    file.status = 'uploading';

    const interval = setInterval(() => {
      if (file.progress < 100) {
        file.progress += 10;
      } else {
        clearInterval(interval);
        const success = Math.random() > 0.3;
        file.status = success ? 'success' : 'error';
      }
    }, 200);
  }

  isLoading: boolean = false;

  hasValidResume(): boolean {
    return this.uploadedFiles?.some(
      file => file.status !== 'uploading' && file.status !== 'error'
    );
  }
  

  // onSubmit(): void {
  //   this.resumeTouched = true;

  //   if (!this.resumeUploaded || this.jobForm.invalid) {
  //     this.jobForm.markAllAsTouched();
  //     return;
  //   }

  //   if (this.jobForm.valid && this.selectedFile) {
  //     const formData = new FormData();
  //     this.isLoading = true;
  //     // formData.append('jobId', this.jobId);
  //     formData.append('name', this.jobForm.get('name')?.value);
  //     formData.append('email', this.jobForm.get('email')?.value);
  //     formData.append('phone', this.jobForm.get('phone')?.value);
  //     formData.append('resume', this.selectedFile);

  //     if (this.jobId) {
  //       formData.append('jobId', this.jobId);
  //     }

  //     this.http
  //       .post(`${environment.apiUrl}/admin/applyJobcsl`, formData)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Application submitted:', response);
  //           this.jobForm.reset();
  //           this.selectedFile = null;
  //           this.uploadedFileName = '';
  //           this.formSubmitted = true; // Set the flag to show the success notification
  //           this.cdr.detectChanges();
  //           setTimeout(() => {
  //             this.formSubmitted = false; // Optionally hide the notification after a few seconds
  //           }, 5000); // Hide after 5 seconds
  //         },
  //         error: (error) => {
  //           console.error('Application error:', error);
  //         },
  //         complete: () => {
  //           this.isLoading = false; // Set loading state to false after submission is complete
  //         },
  //       });
  //   } else {
  //     console.warn('Form is invalid or file not selected');
  //   }
  // }

  // onSubmit(): void {
  //   this.resumeTouched = true;

  //   if (!this.resumeUploaded || this.jobForm.invalid) {
  //     this.jobForm.markAllAsTouched();
  //     return;
  //   }

  //   if (this.jobForm.valid && this.selectedFile) {
  //     const formData = new FormData();
  //     this.isLoading = true;

  //     formData.append('name', this.jobForm.get('name')?.value);
  //     formData.append('email', this.jobForm.get('email')?.value);
  //     formData.append('phone', this.jobForm.get('phone')?.value);
  //     formData.append('resume', this.selectedFile);

  //     if (this.jobId) {
  //       formData.append('jobId', this.jobId);
  //     }

  //     this.http
  //       .post(`${environment.apiUrl}/admin/applyJobcsl`, formData)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Application submitted:', response);

  //           // Reset form and file state
  //           this.jobForm.reset();
  //           this.selectedFile = null;
  //           this.uploadedFileName = '';
  //           this.uploadedFiles = [];

  //           this.formSubmitted = true;
  //           this.resumeTouched = false; // ✅ Clear validation flags
  //           this.cdr.detectChanges();

  //           setTimeout(() => {
  //             this.formSubmitted = false;
  //             this.resumeUploaded = false; // ✅ Only reset this after success message disappears
  //             this.cdr.detectChanges();
  //           }, 5000);
  //         },
  //         error: (error) => {
  //           console.error('Application error:', error);
  //         },
  //         complete: () => {
  //           this.isLoading = false;
  //         },
  //       });
  //   } else {
  //     console.warn('Form is invalid or file not selected');
  //   }
  // }

  // onSubmit(): void {
  //   this.resumeTouched = true;

  //   // If resume not uploaded or form is invalid, mark all controls as touched and exit
  //   if (!this.resumeUploaded || this.jobForm.invalid) {
  //     this.jobForm.markAllAsTouched();
  //     return;
  //   }

  //   // Check if file is selected before proceeding
  //   if (!this.selectedFile) {
  //     console.warn('No resume file selected.');
  //     return;
  //   }

  //   // Prepare FormData
  //   const formData = new FormData();
  //   formData.append('name', this.jobForm.get('name')?.value || '');
  //   formData.append('email', this.jobForm.get('email')?.value || '');
  //   formData.append('phone', this.jobForm.get('phone')?.value || '');
  //   formData.append('resume', this.selectedFile);

  //   if (this.jobId) {
  //     formData.append('jobId', this.jobId);
  //   }

  //   this.isLoading = true;

  //   this.http
  //     .post(`${environment.apiUrl}/admin/applyJobcsl`, formData)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Application submitted successfully:', response);

  //         // Reset form and file state
  //         this.jobForm.reset();
  //         this.selectedFile = null;
  //         this.uploadedFileName = '';
  //         this.uploadedFiles = [];
  //         this.resumeUploaded = false;
  //         this.resumeTouched = false;

  //         // Reset file input element after submission
  //         const fileInput = document.querySelector('input[type="file"]');
  //         if (fileInput instanceof HTMLInputElement) {
  //           fileInput.value = ''; // Reset the file input
  //         }

  //         // Show success notification
  //         this.formSubmitted = true;
  //         this.cdr.detectChanges();

  //         // Hide notification after 5 seconds
  //         setTimeout(() => {
  //           this.formSubmitted = false;
  //           this.cdr.detectChanges();
  //         }, 5000);
  //       },
  //       error: (error) => {
  //         console.error('Application submission failed:', error);
  //         this.isLoading = false;
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //       },
  //     });
  // }

 

  onSubmit(): void {
    this.resumeTouched = true;

    // If resume not uploaded or form is invalid, mark all controls as touched and exit
    if (!this.resumeUploaded || this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    // Check if file is selected before proceeding
    if (!this.selectedFile) {
      console.warn('No resume file selected.');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.jobForm.get('name')?.value || '');
    formData.append('email', this.jobForm.get('email')?.value || '');
    formData.append('phone', this.jobForm.get('phone')?.value || '');
    formData.append('resume', this.selectedFile);

    if (this.jobId) {
      formData.append('jobId', this.jobId);
    }

    this.isLoading = true;

    this.http
      .post(`${environment.apiUrl}/admin/applyJobcsl`, formData)
      .subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);

          // Reset form and file state
          this.jobForm.reset();
          this.selectedFile = null;
          this.uploadedFileName = '';
          this.uploadedFiles = [];
          this.resumeUploaded = false;
          this.resumeTouched = false;

          // Reset file input element after submission
          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Reset the file input
          }

          // Show success notification
          this.formSubmitted = true;
          this.cdr.detectChanges();

          // Hide notification after 5 seconds
          setTimeout(() => {
            this.formSubmitted = false;
            this.cdr.detectChanges();
          }, 5000);
        },
        error: (error) => {
          console.error('Application submission failed:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
