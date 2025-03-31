import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService } from 'app/authentication/authServices';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { EmployeesDataService } from 'app/admin/employees/services';
import { EmployeesService } from '../employee.service';
import { paySlip } from '../payroll/model';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent {
  displayedColumns = [
    'employeeName',
    'salaryMonth',
    'salaryYear',
    'payslip',
    //'actions'
  ];

  monthOptions: { label: string; value: number }[] = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  userIsAuthenticated: any;
  month: any;
  year: any;
  employeeName: any;
  paySlipData: paySlip[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  isLoading = false;
  yearOptions: number[] = [];
  private authStatusSub!: Subscription;
  dataSource = new MatTableDataSource<any>();
  from!: FormGroup;
  form: any;
  currentPage: any;
  employees: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: EmployeesService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    //private dataService2: EmployeesDataService,
  ) {
  }
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.isLoading = true;

    const currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1;

    // Populate yearOptions with a range of years
    const startYear = this.year - 5; // 5 years back from the current year
    for (let i = startYear; i <= this.year; i++) {
      this.yearOptions.push(i);
    }

    this.form = this.formBuilder.group({
      y: [],
      m: [],
    });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
    this.fetchData();
    //this.fetchEmployees();
  }

  fetchData(page = 1, limit = 10, year?: any, month?: any): void {
    this.isLoading = true;
    this.dataService
      .getAllPaySlip(page, limit, year, month)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.paySlipData = response.paySlips;
          this.currentPage = response.page;
          this.totalCount = response.totalItems;
          this.dataSource.data = this.paySlipData;
        },
        error: (error) => {
          // Handle the error
          console.error(error);
        },
      });
  }

  // fetchEmployees() {
  //   this.dataService2.getEmployees().subscribe({
      
  //     next: (value: any) => {
  //       this.employees = value.data.data;
  //     },
  //     error: (error: any) => {
  //       // Error handler
  //       console.error('Error occurred:', error);
  //     },
  //     complete: () => {
  //       // Complete handler
  //       console.log('Observable completed.');
  //     },
  //   });
  // }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.fetchData(page, limit);
  }

  onSearch(): void {
    const year = this.form.get('y')?.value;
    const month = this.form.get('m')?.value;
    this.fetchData(1, this.limit, year, month);
  }

  onResetSearch(): void {
    this.form.reset();
    this.fetchData();
  }

  // Delete(row: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.value) {
  //       this.dataService.delete(row._id).subscribe({
  //         next: (res: any) => {
  //           const snackBarRef = this.snackBar.open("Deleted....", '', {
  //             duration: 2000,
  //             verticalPosition: 'bottom',
  //             horizontalPosition: 'center',
  //             panelClass: 'snackbar-danger',
  //           });
  //           snackBarRef.afterDismissed().subscribe(() => {
  //             // Handle after the snackbar is dismissed
  //           });
  //           // Perform any additional actions after successful deletion
  //           this.fetchData();
  //         },
  //         error: (error: any) => {
  //           console.error(error);
  //           // Handle error if the deletion request fails
  //         }
  //       });
  //       Swal.fire('Deleted!', 'Your leave request has been deleted.', 'success');
  //     }
  //   });
  // }


  ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    this.authStatusSub.unsubscribe();
    this.paySlipData = [];
    this.employees = [];
  }
}

