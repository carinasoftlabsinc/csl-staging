import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/authentication/authServices';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BlogService } from '../../blog.service';
import { MatSort } from '@angular/material/sort';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-privacy-terms',
  templateUrl: './privacy-terms.component.html',
  styleUrls: ['./privacy-terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivacyTermsComponent {
  config2: AngularEditorConfig = {
    toolbarPosition: 'top',
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      { name: 'quote', class: 'quote' },
      { name: 'redText', class: 'redText' },
      { name: 'titleText', class: 'titleText', tag: 'h1' },
    ],
  };     
data: any[] = [];
  page = 1;
  limit = 10;
  totalCount = 0;
  filter = '';
  private dataSubscription!: Subscription;
  isLoading = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'designation', 'actions'];
  
  selectedType: string = 'terms';
  content: string = '';
  currentId: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userIsAuthenticated: any;
  constructor(
    private dataService: BlogService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }

  
  ngOnInit(): void {
    this.isLoading = true;
    this.fetchPolicy(this.selectedType);
    this.getData();
  }
  getData(): void {
    this.isLoading = true;

    if (this.filter && this.page > 1) {
      this.page = 1;
      this.paginator.pageIndex = 0;
    }

    this.dataSubscription = this.dataService
      .getTmgsTeam(this.page, this.limit, this.filter)
      .subscribe((response: { data: any[]; totalCount: number }) => {
        this.isLoading = false;
        this.data = response.data;
        this.dataSource.data = this.data;
        this.totalCount = response.totalCount;
      });
  }

 

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }   


  onTypeChange(type: string) {
    this.fetchPolicy(type);
  }

  fetchPolicy(type: string) {
    this.isLoading = true;
    this.dataService.getTmgsTermsPolicy(type).subscribe({
      next: (res: any) => {
        this.content = res?.data?.content || '';
        this.currentId = res?.data?._id || '';
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to fetch policy.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSave() {
    const payload = {
      type: this.selectedType,
      content: this.content
    };
    this.dataService.updateTmgsTermsPolicy(payload).subscribe({
      next: () => {
        this.snackBar.open('Policy updated successfully.', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update policy.', 'Close', { duration: 3000 });
      }
    });
  }
}
