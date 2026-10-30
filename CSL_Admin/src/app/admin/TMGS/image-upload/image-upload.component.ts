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
import { AddImageUploadComponent } from './add-image-upload/add-image-upload.component';
// import { AddTmgsCareersComponent } from './add-tmgs-careers/add-tmgs-careers.component';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImageUploadComponent {
 data: any[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['preview','path','uploadedAt'];
  imageBaseUrl = environment.imageBaseUrl;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userIsAuthenticated: any;
  constructor(
    private dataService: BlogService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }

  folderList: string[] = [];
  selectedFolder: string = '';
  
  ngOnInit(): void {
    this.isLoading = true;
    this.getFolderList(); // Get the folder list first
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
    this.getData();
  }
  
  // API to get folder list
  getFolderList(): void {
    this.dataService.getImageFolders().subscribe((response: any) => {
      this.folderList = response?.data || [];
    }, () => {
      // The error message is shown by the error interceptor.
    });
  }
  
  // When folder is changed
  onFolderChange(): void {
    this.page = 1;
    this.getData();
  }
  
  // Update your getData() like this:
  getData(): void {
    this.isLoading = true;
  
    if (this.filter && this.page > 1) {
      this.page = 1;
      this.paginator.pageIndex = 0;
    }
  
    this.dataSubscription = this.dataService
      .getUploadedImages(this.page, this.limit, this.filter, this.selectedFolder) // pass selected folder
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
         this.dataService.DeleteCareerPost(row._id).subscribe({
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

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddImageUploadComponent, {
      ...FORM_DIALOG_OPTIONS,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  openEditDialog(row?: any): void {
    const dialogRef = this.dialog.open(AddImageUploadComponent, {
      ...FORM_DIALOG_OPTIONS,
      data: row ? { ...row } : {},
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

 

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }   
}
