import { FORM_DIALOG_OPTIONS } from 'app/shared/form-dialog-options';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/authentication/authServices';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BlogService } from '../../blog.service';
import { MatSort } from '@angular/material/sort';
import { AddBlogsTmgsComponent } from './add-blogs-tmgs/add-blogs-tmgs.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { TmgsBlogOrderComponent } from './tmgs-blog-order/tmgs-blog-order.component';

const BACKEND_URL = environment.apiUrl + '/admin/';

@Component({
  selector: 'app-tmgs-blogs',
  templateUrl: './tmgs-blogs.component.html',
  styleUrls: ['./tmgs-blogs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TmgsBlogsComponent {
  data: any[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'heading',
    'category',
    'author',
    'feature',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userIsAuthenticated: any;
  constructor(
    private dataService: BlogService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.dataSource = new MatTableDataSource<any>(this.data);
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
      this.page = 1;
      this.paginator.pageIndex = 0;
    }

    this.dataSubscription = this.dataService

      .getTmgsBlogsData(this.page, this.limit, this.filter)
      .subscribe((response: { data: any[]; totalCount: number }) => {
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

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }

  Delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.dataService.DeleteBlog(row._id).subscribe({
          next: () => {
            const snackBarRef = this.snackBar.open('Deleted....', '', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-danger',
            });
            snackBarRef.afterDismissed().subscribe(() => {
              // Handle after the snackbar is dismissed
            });
            this.getData();
          },
          error: () => {
            // Handle error if the deletion request fails
          },
        });
        Swal.fire('Deleted!', '', 'success');
      }
    });
  }

  // openGameOrderDialog() {
  //   this.http.get<any>(`${BACKEND_URL}getBlogTitles`).subscribe((res) => {
  //     this.dialog
  //       .open(TmgsBlogOrderComponent, {
  //         width: '600px',
  //         data: { blogs: res.data.blogs },
  //       })
  //       .afterClosed()
  //       .subscribe((updated) => {
  //         if (updated) {
  //           // Refresh game list or show a message
  //         }
  //       });
  //   });
  // }

  openGameOrderDialog() {
  this.http.get<any>(`${BACKEND_URL}getBlogTitles`).subscribe({
    next: (res) => {
      this.dialog
        .open(TmgsBlogOrderComponent, {
          width: '600px',
          data: { blogs: res.data.blogs },
        })
        .afterClosed()
        .subscribe((updated) => {
          if (updated) {
            this.getData();
          }
        });
    },
    error: () => {
      this.snackBar.open('Failed to load blog titles. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    },
  });
}

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddBlogsTmgsComponent, {
      ...FORM_DIALOG_OPTIONS,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  openEditDialog(row?: any): void {
    const dialogRef = this.dialog.open(AddBlogsTmgsComponent, {
      ...FORM_DIALOG_OPTIONS,
      data: row ? { ...row } : {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  getPlatformNames(platforms: any[]): string {
    return platforms.map((platform) => platform.name).join(', ');
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;

    // Optimistically update the UI
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...this.data];

    const item = this.data[event.currentIndex];
    const globalIndex = (this.page - 1) * this.limit + event.currentIndex;

    const payload = {
      id: item._id,
      orderIndex: globalIndex, // global position
    };

    this.dataService.updateTmgsBlogOrderIndex(payload).subscribe({
      next: () => {
        this.snackBar.open('Blog order updated successfully!', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-success',
        });
        this.getData(); // Refresh the page data after reorder
      },
      error: () => {
        this.snackBar.open('Failed to update blog order.', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger',
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
