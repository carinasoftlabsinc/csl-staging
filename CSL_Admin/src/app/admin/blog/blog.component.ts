import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/authentication/authServices';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BlogService } from '../blog.service';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlogReorderComponent } from './blog-reorder/blog-reorder.component';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/admin/';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BlogComponent {
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
    'title',
    'category',
    'author',
    'date',
    'view',
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
    private http: HttpClient,
    private router: Router
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
      .getData(this.page, this.limit, this.filter)
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
        this.dataService.deleteRequest(row._id).subscribe({
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

  // The blog page edits the whole post: details, covers, body and FAQs.
  openAddClubDialog(): void {
    this.router.navigate(['/admin/blogs/new']);
  }

  openEditClubDialog(row: any): void {
    this.router.navigate(['/admin/blogs', row._id, 'edit']);
  }

  //   drop(event: CdkDragDrop<any[]>) {
  //   if (event.previousIndex === event.currentIndex) return;

  //   moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  //   this.dataSource.data = [...this.data];

  //   // Only send updated item
  //   const item = this.data[event.currentIndex];
  //   const payload = {
  //     id: item._id,
  //     orderIndex: event.currentIndex
  //   };

  //   this.dataService.updateBlogOrderIndex(payload).subscribe({
  //     next: () => {
  //       this.snackBar.open('Blog order updated successfully!', '', {
  //         duration: 2000,
  //         verticalPosition: 'bottom',
  //         horizontalPosition: 'center',
  //         panelClass: 'snackbar-success'
  //       });
  //       this.getData();
  //     },
  //     error: (err) => {
  //       this.snackBar.open('Failed to update blog order.', '', {
  //         duration: 2000,
  //         verticalPosition: 'bottom',
  //         horizontalPosition: 'center',
  //         panelClass: 'snackbar-danger'
  //       });
  //     }
  //   });
  // }

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

    this.dataService.updateBlogOrderIndex(payload).subscribe({
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

  openGameOrderDialog() {
    this.http.get<any>(`${BACKEND_URL}getBlogTitlesWithOrder`).subscribe({
      next: (res) => {
        this.dialog
          .open(BlogReorderComponent, {
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
        this.snackBar.open(
          'Failed to load blog titles. Please try again.',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
