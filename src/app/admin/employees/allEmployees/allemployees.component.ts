import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate } from '@angular/common';
import { AuthService } from 'app/authentication/authServices';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeesDataService } from '../services';
import { Employees } from '../model';
@Component({
  selector: 'app-allemployees',
  templateUrl: './allemployees.component.html',
  styleUrls: ['./allemployees.component.scss'],
})
export class AllemployeesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  data: Employees[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  sortField = 'createdAt';
  sortOrder = 'desc';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'name',
    'email',
    'date',
    'addedBy',
    'shifts',
    'active',
    'isProbation',
    'actions',
  ];

  userIsAuthenticated: any;
  constructor(
    private dataService: EmployeesDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;
  // @ViewChild('filter', { static: true }) filter!: ElementRef;
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
        Shifts: x.shifts,
        Probation: x.isProbation ? "YES" : "NO",
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }


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
        Swal.fire('Deleted!', 'Your employee has been deleted.', 'success');
      }
    });
  }

  Probation(row: any) {
    const newProbationStatus = !row.isProbation; // Toggle the probation status

    Swal.fire({
      title: 'Are you sure?',
      text: "You want be update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
    }).then((result) => {
      if (result.value) {
        this.dataService.probation(row._id, newProbationStatus).subscribe({
          next: (res: any) => {
            const snackBarRef = this.snackBar.open(
              'Probation status updated.',
              '',
              {
                duration: 2000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: 'snackbar-success',
              }
            );
            snackBarRef.afterDismissed().subscribe(() => {
              // Handle after the snackbar is dismissed
            });
            // Perform any additional actions after successful probation status update
            this.getData();
          },
          error: (error: any) => {
            console.error(error);
            // Handle error if the probation status update request fails
          },
        });
        Swal.fire('Success!', 'Probation status updated.', 'success');
      }
    });
  }

  override ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    if (this.dataSubscription) {
      this.authStatusSub.unsubscribe();
      this.dataSubscription.unsubscribe();
    }
  }
}
