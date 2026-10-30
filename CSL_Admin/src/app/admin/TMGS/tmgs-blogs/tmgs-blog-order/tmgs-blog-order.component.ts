// import { Component, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { HttpClient } from '@angular/common/http';
// import { MatSnackBar } from '@angular/material/snack-bar';

// const BACKEND_URL = environment.apiUrl + '/admin/';

// @Component({
//   selector: 'app-tmgs-blog-order',
//   templateUrl: './tmgs-blog-order.component.html',
//   styleUrls: ['./tmgs-blog-order.component.scss']
// })
// export class TmgsBlogOrderComponent {
//  displayedColumns: string[] = ['drag', 'name', 'orderId'];
//   games: any[] = [];

//   constructor(
//     private dialogRef: MatDialogRef<TmgsBlogOrderComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private http: HttpClient,
//     private snackBar: MatSnackBar

//   ) {
//     this.games = [...data.blogs]; // clone to avoid mutating original
//   }

// trackById(index: number, item: any): string {
//   return item._id;
// }

// drop(event: CdkDragDrop<any[]>) {
//   moveItemInArray(this.games, event.previousIndex, event.currentIndex);
//   this.games.forEach((game, index) => (game.orderId = index + 1));
//   this.games.sort((a, b) => a.orderId - b.orderId);
//   this.games = [...this.games]; // Force UI update
// }


//   // saveOrder() {
//   //   const payload = this.games.map(g => ({ gameId: g._id, orderId: g.orderId }));
//   //   this.http.patch('http://localhost:8086/web/v1/admin/gamesOrder', { orders: payload }).subscribe(() => {
//   //     this.dialogRef.close(true); // success
//   //   });
//   // }

//   saveOrder() {
//   const payload = this.games.map(g => ({ gameId: g._id, orderId: g.orderId }));
  
//   this.http.patch(`${BACKEND_URL}updateBlogOrder`, { orders: payload }).subscribe({
//     next: () => {
//       this.snackBar.open('Game order updated successfully!', 'Close', {
//         duration: 3000,
//         panelClass: ['snackbar-success']  
//       });
//       this.dialogRef.close(true);
//     },
//     error: () => {
//       this.snackBar.open('Failed to update game order. Try again.', 'Close', {
//         duration: 3000,
//         panelClass: ['snackbar-error']  
//       });
//     }
//   });
// }


//   close() {
//     this.dialogRef.close(false);
//   }
// }


import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl + '/admin/';

@Component({
  selector: 'app-tmgs-blog-order',
  templateUrl: './tmgs-blog-order.component.html',
  styleUrls: ['./tmgs-blog-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TmgsBlogOrderComponent {
  displayedColumns: string[] = ['drag', 'title', 'orderIndex'];
  blogs: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<TmgsBlogOrderComponent>,
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

    this.http.patch(`${BACKEND_URL}updateBlogOrder`, { orders: payload }).subscribe({
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
