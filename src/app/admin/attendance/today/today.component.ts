import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { AdminAttenDance } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/authentication/authServices';
import { AdminAttendanceService } from '../service';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
})
export class TodayComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{

  displayedColumns = [
    'img',
    'employeeName',
    'date',
    'checkInTime',
    'checkOutTime',
    'totalHours',
    'status',
    // 'actions'
  ];
  userIsAuthenticated: any;
  imageBaseUrl = environment.imageBaseUrl;
  data: AdminAttenDance[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  employeeName = '';
  sortField = 'createdAt';
  sortOrder = 'desc';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource = new MatTableDataSource<any>();

  constructor(
    public httpClient: HttpClient,
    private dataService: AdminAttendanceService, 
    private authService: AuthService, 
    private snackBar: MatSnackBar,
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
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe((isAuthenticated: any) => {
      this.isLoading = false;
      this.userIsAuthenticated = isAuthenticated;
    });
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    
    if (this.employeeName && this.page > 1) {
      // If a filter is applied and the current page is greater than 1,
      // reset the page to 1 to ensure filtered data is fetched correctly
      this.page = 1;
      this.paginator.pageIndex = 0;
    }
    
    this.dataSubscription = this.dataService.getTodayAttendance(this.page, this.limit, this.employeeName)
      .subscribe(response => {
        console.log(response)
        this.isLoading = false;
        this.data = response.attendanceRecords ;
        this.dataSource.data = this.data;
        this.totalCount = response.totalCount;
      });
  }

  onFilterChange(filter: string): void {
    this.employeeName = filter;
    this.getData();
  }

  clearFilter(): void {
    this.employeeName = '';
    this.getData();
  }
  
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Name: x.employeeName,
        Date: formatDate(new Date(x.date), 'dd-MM-yyyy', 'en') || '',
        CheckIn : x.checkInTime ? formatDate(new Date(x.checkInTime), 'hh:mm a', 'en') || '' : '',
        CheckOut: x.checkOutTime ? formatDate(new Date(x.checkOutTime), 'hh:mm a', 'en') || '' : '',
        totalHours: x.totalHours,
        status: x.status
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }


  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }

  override ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    if (this.dataSubscription) {
      this.authStatusSub.unsubscribe();
      this.dataSubscription.unsubscribe();
    }
  }
}
