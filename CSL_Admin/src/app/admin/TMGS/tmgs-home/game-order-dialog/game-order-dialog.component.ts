import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl + '/admin/';
@Component({
  selector: 'app-game-order-dialog',
  templateUrl: './game-order-dialog.component.html',
  styleUrls: ['./game-order-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GameOrderDialogComponent {
 displayedColumns: string[] = ['drag', 'name', 'orderId'];
  games: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<GameOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar

  ) {
    this.games = [...data.games]; // clone to avoid mutating original
  }

trackById(index: number, item: any): string {
  return item._id;
}

drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(this.games, event.previousIndex, event.currentIndex);
  this.games.forEach((game, index) => (game.orderId = index + 1));
  this.games.sort((a, b) => a.orderId - b.orderId);
  this.games = [...this.games]; // Force UI update
}


  // saveOrder() {
  //   const payload = this.games.map(g => ({ gameId: g._id, orderId: g.orderId }));
  //   this.http.patch('http://localhost:8086/web/v1/admin/gamesOrder', { orders: payload }).subscribe(() => {
  //     this.dialogRef.close(true); // success
  //   });
  // }

  saveOrder() {
  const payload = this.games.map(g => ({ gameId: g._id, orderId: g.orderId }));
  
  this.http.patch(`${BACKEND_URL}gamesOrder`, { orders: payload }).subscribe({
    next: () => {
      this.snackBar.open('Game order updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']  
      });
      this.dialogRef.close(true);
    },
    error: () => {
      this.snackBar.open('Failed to update game order. Try again.', 'Close', {
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
