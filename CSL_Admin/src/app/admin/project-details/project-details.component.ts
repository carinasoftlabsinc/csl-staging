import { FORM_DIALOG_OPTIONS } from 'app/shared/form-dialog-options';
import { Component, ViewChild, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/authentication/authServices';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BlogService } from '../blog.service';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddProjectDetailsComponent } from './add-project-details/add-project-details.component';

/** A project as listed in the table; the edit dialog receives the full record. */
interface ProjectRow {
  _id: string;
  title: string;
  category: string;
  isActive?: boolean;
  [field: string]: unknown;
}

/** Category filter tabs; values match the category saved on each project. */
const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'game', label: 'Game' },
  { value: 'app', label: 'App' },
  { value: 'web', label: 'Web' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'ai-emerging-technology', label: 'AI & Emerging Technology' },
];

/** A category holds few projects, so it loads in one page and can be reordered as a whole. */
const CATEGORY_PAGE_LIMIT = 500;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private dataService = inject(BlogService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  data: ProjectRow[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  private dataSubscription!: Subscription;
  isLoading = false;
  private authStatusSub!: Subscription;
  dataSource = new MatTableDataSource<ProjectRow>(this.data);
  readonly categories = PROJECT_CATEGORIES;
  category = 'all';
  isSavingOrder = false;
  /** The order as last loaded or saved; dragging changes `data` until Save or Cancel. */
  private savedOrder: ProjectRow[] = [];
  userIsAuthenticated = false;

  // The project form is long and wide, so it gets more room than the other form dialogs.
  private readonly projectDialogOptions = { ...FORM_DIALOG_OPTIONS, width: '1600px' };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Drag reordering works inside one category, on the full unfiltered list. */
  get canReorder(): boolean {
    return this.category !== 'all' && !this.filter && this.data.length > 1;
  }

  /** True while the dragged order differs from the saved one. */
  get orderChanged(): boolean {
    // Not tied to canReorder: the search box updates `filter` before onFilterChange runs.
    return (
      this.category !== 'all' &&
      this.data.some((item, index) => item._id !== this.savedOrder[index]?._id)
    );
  }

  /** Readable category name for the table (e.g. "AI & Emerging Technology" instead of the stored slug). */
  categoryLabel(value: string): string {
    return PROJECT_CATEGORIES.find((option) => option.value === value)?.label ?? value;
  }

  get displayedColumns(): string[] {
    return this.canReorder
      ? ['drag', 'title', 'category', 'status', 'actions']
      : ['title', 'category', 'status', 'actions'];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
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

    const inCategory = this.category !== 'all';
    this.dataSubscription = this.dataService
      .getProjectData(
        inCategory ? 1 : this.page,
        inCategory ? CATEGORY_PAGE_LIMIT : this.limit,
        this.filter,
        this.category,
      )
      .subscribe((response: { data: ProjectRow[]; totalCount: number }) => {
        this.isLoading = false;
        this.data = response.data;
        this.savedOrder = [...response.data];
        this.dataSource.data = this.data;
        this.totalCount = response.totalCount;
      });
  }

  async onFilterChange(filter: string): Promise<void> {
    if (!(await this.confirmDiscardOrder())) {
      this.filter = '';
      return;
    }
    this.filter = filter;
    this.getData();
  }

  async clearFilter(): Promise<void> {
    if (!(await this.confirmDiscardOrder())) return;
    this.filter = '';
    this.getData();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getData();
  }

  async onCategoryChange(category: string): Promise<void> {
    if (category === this.category || !(await this.confirmDiscardOrder())) return;
    this.category = category;
    this.page = 1;
    if (this.paginator) this.paginator.pageIndex = 0;
    this.getData();
  }

  /** Dragging only rearranges the rows; nothing is sent until Save. */
  onDrop(event: CdkDragDrop<ProjectRow[]>): void {
    if (!this.canReorder || event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.data = [...this.data];
  }

  saveOrder(): void {
    if (!this.orderChanged || this.isSavingOrder) return;
    this.isSavingOrder = true;

    this.dataService.reorderProjects(this.category, this.data.map((item) => item._id)).subscribe({
      next: () => {
        this.isSavingOrder = false;
        this.savedOrder = [...this.data];
        this.notify('Order saved', 'snackbar-success');
      },
      error: () => {
        // Keep the new order on screen so the user can retry or cancel.
        this.isSavingOrder = false;
        this.notify('The order could not be saved. Please try again.', 'snackbar-danger');
      },
    });
  }

  cancelOrder(): void {
    this.data = [...this.savedOrder];
  }

  /** Asks before throwing away an unsaved order; resolves true when it is safe to continue. */
  private async confirmDiscardOrder(): Promise<boolean> {
    if (!this.orderChanged) return true;
    const result = await Swal.fire({
      title: 'Discard the new order?',
      text: 'You changed the order but did not save it.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Discard',
      cancelButtonText: 'Keep editing',
    });
    if (result.isConfirmed) this.cancelOrder();
    return result.isConfirmed;
  }

  toggleStatus(item: ProjectRow, isActive: boolean): void {
    const previous = item.isActive;
    item.isActive = isActive;

    this.dataService.setProjectStatus(item._id, isActive).subscribe({
      next: () =>
        this.notify(
          isActive ? 'Project is now shown on the website' : 'Project is now hidden from the website',
          'snackbar-success'
        ),
      error: () => {
        item.isActive = previous;
        this.data = [...this.data];
        this.notify('The status could not be changed. Please try again.', 'snackbar-danger');
      },
    });
  }

  Delete(row: ProjectRow) {
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
        this.dataService.deleteProjectRequest(row._id).subscribe({
          next: () => {
            this.notify('Deleted....', 'snackbar-danger');
            this.getData();
          },
          error: () => this.notify('The project could not be deleted. Please try again.', 'snackbar-danger'),
        });
        Swal.fire('Deleted!', '', 'success');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDetailsComponent, {
      ...this.projectDialogOptions,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  openEditDialog(row?: ProjectRow): void {
    const dialogRef = this.dialog.open(AddProjectDetailsComponent, {
      ...this.projectDialogOptions,
      data: row ? { ...row } : {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

  private notify(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 2500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass,
    });
  }
}
