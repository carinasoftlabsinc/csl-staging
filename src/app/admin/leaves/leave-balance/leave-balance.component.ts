import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import {Observable, Subscription, map, startWith } from 'rxjs';

import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate } from '@angular/common';
import { AuthService } from 'app/authentication/authServices';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '../services';
import { EmployeesDataService } from 'app/admin/employees/services';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss'],
})
export class LeaveBalanceComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  data: any = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  displayedColumns: string[] = [
    'employeeName',
    'casualLeave',
    'personalLeave',
    'medicalLeave',
    'maternityLeave',
    'LWP',
    'actions',
  ];
  employees: any[] = [];
  dataSource = new MatTableDataSource<any>();
  userIsAuthenticated: any;
  constructor(
    private dataService: LeaveService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dataService2: EmployeesDataService,
    private dialog: MatDialog
  ) {
    super();
    
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };
  // Add a new FormControl for the autocomplete input
  searchInputControl = new FormControl();
  filteredEmployees!: Observable<any[]>;
  selectedEmployee: any; // Add a new property to store the selected employee

  ngOnInit() {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
    this.getData();
    this.fetchEmployees();
    this.filteredEmployees = this.searchInputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployees(value))
    );
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
      .getAllEmployeePaidLeaves(
        this.page,
        this.limit,
        this.filter,
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.data = response.data;
        this.dataSource.data = this.data;
        this.totalCount = response.totalCount;
      });
  }


  private _filterEmployees(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter((employee) => employee.name.toLowerCase().includes(filterValue));
  }

  onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    // Get the selected employee name and set it as the filter value
    this.selectedEmployee = event.option.value;
    this.filter = this.selectedEmployee;
    this.getData();
  }

  fetchEmployees() {
    // this.isLoading= true;
    this.dataService2.getEmployees().subscribe({
      
      next: (value: any) => {
        // this.isLoading = false;
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
  
  onFilterChange(filter: string): void {
    this.filter = filter;
    this.getData();
  }

  clearSearch(): void {
    // Clear the search input and filter
    this.searchInputControl.setValue('');
    this.selectedEmployee = null;
    this.filter = '';
    this.getData();
  }


  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }

  openEditDialog(item: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item; // Pass the data you want to edit to the dialog component
    dialogConfig.width = '500px'; // Customize the dialog width as needed
  
    const dialogRef = this.dialog.open(FormComponent, dialogConfig); // Use FormComponent instead of EditDialogComponent
  
    dialogRef.afterClosed().subscribe((result) => {
      // Check if result is not undefined (i.e., the dialog was closed with changes)
      if (result !== undefined) {
        
        this.dataService.UpdatePaidLeave(
          result.casualLeave,
          result.personalLeave,
          result.medicalLeave,
          result.maternityLeave,
          result.LWP,
          item._id // Pass the ID of the item to be updated
        );
        this.getData();
      }
    });
  }
  
  override ngOnDestroy(): void {
    // Unsubscribe from the data subscription to prevent memory leaks
    if (this.dataSubscription) {
      this.authStatusSub.unsubscribe();
      this.dataSubscription.unsubscribe();
      this.employees = [];
    }
  }

}