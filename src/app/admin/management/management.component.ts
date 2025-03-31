import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Management } from './model';
import { DataService } from './service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'app/authentication/authServices';
import { formatDate } from '@angular/common';
import { TableElement, TableExportUtil } from '@shared';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit, OnDestroy {
  data: Management[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  sortField = 'createdAt';
  sortOrder = 'desc';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource: MatTableDataSource<Management>;
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'date',
    'active',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userIsAuthenticated: any;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Management>(this.data);
  }

  ngOnInit(): void {
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

    if (this.filter && this.page > 1) {
      // If a filter is applied and the current page is greater than 1,
      // reset the page to 1 to ensure filtered data is fetched correctly
      this.page = 1;
      this.paginator.pageIndex = 0;
    }

    this.dataSubscription = this.dataService
      .getData(
        this.page,
        this.limit,
        this.filter,
        this.sortField,
        this.sortOrder
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.data = response.data;
        this.dataSource.data = this.data;
        this.totalCount = response.totalCount;
      });
  }

  onFilterChange(filter: string): void {
    this.filter = filter;
    this.getData();
  }

  clearFilter(): void {
    this.filter = '';
    this.getData();
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Name: x.name,
        Email: x.email,
        Role: x.role,
        'Joining Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
        Phone: x.phone,
        Address: x.address,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }

  // onSortChange(sort: { active: string, direction: string }): void {
  //   this.sortField = sort.active;
  //   this.sortOrder = sort.direction;
  //   this.getData();
  // }

  Delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.dataService.delete(row._id).subscribe({
          next: (res: any) => {
            const snackBarRef = this.snackBar.open('Deleted....', '', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-danger',
            });
            snackBarRef.afterDismissed().subscribe(() => {
              // Handle after the snackbar is dismissed
            });
            // Perform any additional actions after successful deletion
            this.getData();
          },
          error: (error: any) => {
            console.error(error);
            // Handle error if the deletion request fails
          },
        });
        Swal.fire('Deleted!', 'Your management has been deleted.', 'success');
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
