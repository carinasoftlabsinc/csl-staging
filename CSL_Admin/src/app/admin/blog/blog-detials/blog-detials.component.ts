import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlogService } from 'app/admin/blog.service';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'app/authentication/authServices';

@Component({
  selector: 'app-blog-detials',
  templateUrl: './blog-detials.component.html',
  styleUrls: ['./blog-detials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BlogDetialsComponent {
  isLoading = false;
  private authStatusSub!: Subscription;
  imageBaseUrl = environment.imageBaseUrl;
  form!: FormGroup;
  data: any;
  userIsAuthenticated = false;
  existingImageFileName!: string;
  private ID!: string | null;

  constructor(
    private authService: AuthService,
    private service: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  getData() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.ID = paramMap.get('id') || null;
        this.service.getReqByID(this.ID ?? '').subscribe((data) => {
          this.data = data.data.data;
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
      }
    });
  }



  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.data = {};
  }
}
