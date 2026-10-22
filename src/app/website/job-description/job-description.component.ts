import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SeoService } from '@core/service/seo.service';
import { addMissingImageAlts } from '@core/utils/content-images.util';

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
    data: JobPost[];
  };
}

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class JobDescriptionComponent implements OnInit {
  jobPost?: JobPost;
  isNotFound: boolean = false;
  apiUrl = `${environment.apiUrl}/admin/getAllCareerJobPost`;
  imageUrl = `${environment.imageBaseUrl}`;

  jobForm!: FormGroup;
  selectedFile: File | null = null;
  uploadedFileName: string = '';
  formSubmitted: boolean = false;
  uploadedFiles: Array<UploadedFile> = [];

  uploadStatus: 'uploading' | 'success' | 'error' | 'done' | '' = '';
  uploadProgress: number = 0;
  isDragging: boolean = false;

  readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');

    if (jobId) {
      this.fetchJobPost(jobId);
    } else {
      this.isNotFound = true;
      this.seoService.setNotFoundStatus();
    }

    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      resume: [null, [Validators.required]],
    });
  }

  fetchJobPost(id: string): void {
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        const foundJob = response?.data?.data?.find((job) => job._id === id);

        if (foundJob) {
          // Images written in the admin without alt text get one (the editor's own alt text is kept).
          this.jobPost = {
            ...foundJob,
            description: addMissingImageAlts(foundJob.description, foundJob.title),
            content: addMissingImageAlts(foundJob.content, foundJob.title),
          };
          this.isNotFound = false;

          const plainDesc = foundJob.description
            ? foundJob.description.replace(/<[^>]*>/g, '').trim().slice(0, 160)
            : `Apply for ${foundJob.title} at Carina Softlabs.`;

          this.seoService.setPage({
            title: `${foundJob.title} - Careers | Carina Softlabs`,
            description: plainDesc,
            url: `https://carinasoftlabs.com/job-description/${id}`,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'JobPosting',
              title: foundJob.title,
              description: foundJob.description || foundJob.content,
              datePosted: foundJob.createdAt,
              validThrough: foundJob.applicationDeadline,
              employmentType: foundJob.employmentType
                ? foundJob.employmentType.toUpperCase().replace(/\s+/g, '_')
                : 'FULL_TIME',
              hiringOrganization: {
                '@type': 'Organization',
                name: 'Carina Softlabs Inc.',
                sameAs: 'https://carinasoftlabs.com',
                logo: 'https://carinasoftlabs.com/assets/logo.png',
              },
              jobLocation: {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '102, 1st Floor, Krishna Tower, Near Medanta Hospital, Vijay Nagar',
                  addressLocality: 'Indore',
                  addressRegion: 'Madhya Pradesh',
                  postalCode: '452010',
                  addressCountry: 'IN',
                },
              },
              baseSalary: foundJob.salary
                ? {
                    '@type': 'MonetaryAmount',
                    currency: 'INR',
                    value: {
                      '@type': 'QuantitativeValue',
                      value: foundJob.salary,
                    },
                  }
                : undefined,
            },
          });
          this.cdr.detectChanges();
        } else {
          this.isNotFound = true;
          this.seoService.setNotFoundStatus();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching job post data:', error);
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
        this.cdr.detectChanges();
      },
    });
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/job-fallback.png';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

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

  openFile(file: UploadedFile): void {
    const fileURL = URL.createObjectURL(file.file);
    window.open(fileURL, '_blank');
  }

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
    this.jobForm.get('resume')?.markAsTouched();
    this.jobForm.get('resume')?.updateValueAndValidity();

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
    this.uploadedFiles = [uploadedFile];
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
      fileInput.value = '';
    }

    this.cdr.detectChanges();
  }

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

  onSubmit(): void {
    this.resumeTouched = true;

    if (!this.resumeUploaded || this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      console.warn('No resume file selected.');
      return;
    }

    const formData = new FormData();
    const jobId = this.route.snapshot.paramMap.get('id');
    formData.append('name', this.jobForm.get('name')?.value || '');
    formData.append('email', this.jobForm.get('email')?.value || '');
    formData.append('contact', this.jobForm.get('contact')?.value || '');
    formData.append('resume', this.selectedFile);

    if (jobId) {
      formData.append('jobId', jobId);
    }

    this.isLoading = true;

    this.http
      .post(`${environment.apiUrl}/admin/applyJobcsl`, formData)
      .subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);

          this.jobForm.reset();
          this.selectedFile = null;
          this.uploadedFileName = '';
          this.uploadedFiles = [];
          this.resumeUploaded = false;
          this.resumeTouched = false;

          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }

          this.formSubmitted = true;
          this.cdr.detectChanges();

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
