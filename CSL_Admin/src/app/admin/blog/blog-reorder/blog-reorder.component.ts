import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl + '/admin/';

@Component({
  selector: 'app-blog-reorder',
  templateUrl: './blog-reorder.component.html',
  styleUrls: ['./blog-reorder.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BlogReorderComponent {
 displayedColumns: string[] = ['drag', 'title', 'orderIndex'];
  blogs: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<BlogReorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.blogs = [...data.blogs]; // Clone to avoid mutating original input
  }

  trackById(index: number, item: any): string {
    return item._id;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.blogs, event.previousIndex, event.currentIndex);
    this.blogs.forEach((blog, index) => (blog.orderIndex = index + 1));
    this.blogs.sort((a, b) => a.orderIndex - b.orderIndex);
    this.blogs = [...this.blogs]; // Trigger change detection
  }

  saveOrder() {
    const payload = this.blogs.map(b => ({ blogId: b._id, orderIndex: b.orderIndex }));

    this.http.patch(`${BACKEND_URL}updateCslBlogOrder`, { orders: payload }).subscribe({
      next: () => {
        this.snackBar.open('Blog order updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to update blog order. Try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
