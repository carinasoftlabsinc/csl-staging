import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminAttenDance } from '../model';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAttendanceService } from '../service';
import { AuthService } from 'app/authentication/authServices';
import { EmployeesDataService } from 'app/admin/employees/services';
@Component({
  selector: 'app-get-all-employee-attendance',
  templateUrl: './get-all-employee-attendance.component.html',
  styleUrls: ['./get-all-employee-attendance.component.scss'],
})
export class GetAllEmployeeAttendanceComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'employeeName',
    'date',
    'checkInTime',
    'checkOutTime',
    'totalHours',
    'status',
  ];
  userIsAuthenticated: any;
  employees: any[] = [];
  attendanceRecords: AdminAttenDance[] = [];
  currentPage = 1;
  totalPages = 0;
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  sortField = 'createdAt';
  sortOrder = 'desc';
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource = new MatTableDataSource<any>(); // Replace 'any' with the appropriate type for your data
  // Inside the component class
  attendanceForm!: FormGroup;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public attendancesService: AdminAttendanceService,
    private dataService: EmployeesDataService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    super();
  }
  ngOnInit(): void {

    // Initialize the attendanceForm FormGroup
    this.attendanceForm = this.formBuilder.group({
      fromDate: [''], // Set the initial value as needed
      toDate: [''], // Set the initial value as needed
      name: [''],
    });


    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
      this.fetchEmployees();
      this.fetchAttendance();
  }

  fetchAttendance(
    page = 1,
    limit = 10,
    startDate?: string,
    endDate?: string,
    employeeName?: string
  ): void {
    this.isLoading = true;
    this.attendancesService
      .getAllAttendance(page, limit, startDate, endDate, employeeName)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Handle the response and access the attendance records
          this.attendanceRecords = response.attendanceRecords;
          this.currentPage = response.page;
          this.totalCount = response.totalCount;
          this.dataSource.data = this.attendanceRecords;
        },
        error: (error) => {
          // Handle the error
          console.error(error);
        },
      });
  }

  fetchEmployees() {
    this.isLoading= true;
    this.dataService.getEmployees().subscribe({
      
      next: (value: any) => {
        this.isLoading = false;
        this.employees = value.data.data;
      },
      error: (error: any) => {
        // Error handler
        console.error('Error occurred:', error);
      },
      complete: () => {
        // Complete handler
        console.log('Observable completed.');
      },
    });
  }
  
  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.fetchAttendance(page, limit);
  }

  onSearch(): void {
    const startDate = this.attendanceForm.get('fromDate')?.value;
    const endDate = this.attendanceForm.get('toDate')?.value;
    const name = this.attendanceForm.get('name')?.value;
    this.fetchAttendance(1, this.limit, startDate, endDate, name);
  }

  onResetSearch(): void {
    this.attendanceForm.reset();
    this.fetchAttendance();
    this.attendanceRecords = [];
  }

  override ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    this.authStatusSub.unsubscribe();
    this.attendanceRecords = [];
    this.employees = [];
  }
}
