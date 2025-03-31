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
import { EmployeesService } from '../employee.service';
import { Att } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-attendances',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendancesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'date',
    'checkInTime',
    'checkOutTime',
    'totalHours',
    'status',
  ];
  userIsAuthenticated: any;

  attendanceRecords: Att[] = [];
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
  dataSource = new MatTableDataSource<any>();
  attendanceForm!: FormGroup;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: EmployeesService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.isLoading = true;
    this.attendanceForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
    this.fetchAttendance();
  }

  fetchAttendance(
    page = 1,
    limit = 10,
    startDate?: string,
    endDate?: string
  ): void {
    this.isLoading = true;
    this.dataService
      .getAttendance(
        page,
        limit,
        startDate,
        endDate,
        this.sortField,
        this.sortOrder
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Handle the response and access the attendance records
          this.attendanceRecords = response.data.attendanceRecords;
          this.currentPage = response.data.page;
          this.totalCount = response.data.totalPages;
          this.dataSource.data = this.attendanceRecords;
        },
        error: (error) => {
          // Handle the error
          console.error(error);
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
    this.fetchAttendance(1, this.limit, startDate, endDate);
  }

  onResetSearch(): void {
    this.attendanceForm.reset();
    this.fetchAttendance();
  }

  override ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    this.authStatusSub.unsubscribe();
    this.attendanceRecords = [];
  }
}
