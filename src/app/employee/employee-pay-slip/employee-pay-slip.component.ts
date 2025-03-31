import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmployeesService } from '../employee.service';
import { AuthService } from 'app/authentication/authServices';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-employee-pay-slip',
  templateUrl: './employee-pay-slip.component.html',
  styleUrls: ['./employee-pay-slip.component.scss']
})

export class EmployeePaySlipComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  @ViewChild('pdfContent') pdfContent!: ElementRef<HTMLDivElement>;
  ID!: string | null;
  paySlipData: any;

  constructor(
    private service: EmployeesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
      this.getData()
  }
  
  getData() {
    console.log('Getting data...');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.ID = paramMap.get('id');
        this.isLoading = true;
        this.service.getPaySlipDataByID(this.ID ?? '').subscribe(data => {
          this.isLoading = false;
          this.paySlipData = data;
          console.log("data", this.paySlipData )
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  downloadPdf() {
    this.generatePdf();
  }

  private async generatePdf() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Check if pdfContent is available before proceeding
    if (!this.pdfContent || !this.pdfContent.nativeElement) {
      console.error('PDF content element not found.');
      return;
    }

    const content = this.pdfContent.nativeElement;

    // Convert the HTML content to canvas
    const canvas = await html2canvas(content, {
      scale: 2, // Increase the scale to improve the quality (optional)
      logging: false, // Disable logging (optional)
    });

    // Get the canvas data URL
    const imgData = canvas.toDataURL('image/jpeg', 10.0);

    // Add the canvas image to the PDF
    // pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    const targetHeight = 198; // Desired height in millimeters (for A4 height)
    const aspectRatio = canvas.width / canvas.height;
    const targetWidth = targetHeight * aspectRatio;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, targetWidth, targetHeight);
    
    

    // Download the PDF
    pdf.save('file.pdf');
  }
}
